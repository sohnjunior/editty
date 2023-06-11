import { VComponent } from '@/modules/v-component'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { CanvasImageContext, CanvasMetaContext, ArchiveContext } from '@/contexts'
import { Z_INDEX } from '@/utils/constant'
import {
  getSyntheticTouchPoint,
  refineCanvasRatioForRetinaDisplay,
  clearCanvas,
  isPointInsideRect,
  refineImageScale,
  createImageObject,
  getCenterOfBoundingRect,
  getBoundingRectVertices,
  getRotatedBoundingRectVertices,
  get2dMiddlePoint,
  degreeToRadian,
  resizeRect,
  drawCircle,
  drawRect,
  drawCrossLine,
  drawDiagonalArrow,
  drawSECramp,
  drawArc,
  getBearingDegree,
} from '@/modules/canvas-utils/engine'
import { Point } from '@/modules/canvas-utils/types'
import type { Anchor, ImageTransform, ImageObject } from './types'
import { getArchive } from '@/services/archive'
import { filterNullish, findLastIndexOf } from '@/utils/ramda'
import { setMouseCursor, isTouchEvent } from '@/utils/dom'

/** @reference https://developer.mozilla.org/en-US/docs/Web/CSS/cursor */
const MOUSE_CURSOR: Record<ImageTransform, string> = {
  RESIZE: 'nwse-resize',
  DELETE: 'pointer',
  ROTATE: 'pointer',
}

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host #image-layer {
      width: 100%;
      height: 100%;
      z-index: ${Z_INDEX.CANVAS_LAYER.IMAGE};
      position: absolute;
    }
  </style>
  <canvas id="image-layer"></canvas>
`

export default class VCanvasImageLayer extends VComponent<HTMLCanvasElement> {
  static tag = 'v-canvas-image-layer'
  private context!: CanvasRenderingContext2D
  private focused: { image: ImageObject; anchors: Anchor[]; point: Point | null } | null = null
  private transformType: ImageTransform | null = null
  private isPressed = false

  get sid() {
    return ArchiveContext.state.sid!
  }

  get title() {
    return CanvasMetaContext.state.title
  }

  get phase() {
    return CanvasMetaContext.state.phase
  }

  get images() {
    return CanvasImageContext.state.images
  }

  get isActivePhase() {
    return ['cursor', 'gallery'].includes(this.phase)
  }

  constructor() {
    super(template)
  }

  afterCreated() {
    this.initCanvasContext()
    refineCanvasRatioForRetinaDisplay(this.$root)
  }

  private initCanvasContext() {
    const ctx = this.$root.getContext('2d')
    if (!ctx) {
      throw new Error('🚨 canvas load fail')
    }
    this.context = ctx
  }

  afterMount() {
    this.fetchArchive(this.sid)
  }

  private async fetchArchive(sid: string) {
    const data = await getArchive(sid)
    if (data) {
      const createImageObjects = data.images.map(async (image) => {
        const imageObject = await createImageObject({
          dataUrl: image.dataUrl,
          topLeftPoint: { x: image.sx, y: image.sy },
        })
        imageObject.width = image.width
        imageObject.height = image.height
        imageObject.degree = image.degree

        return imageObject
      })

      try {
        const imageObjects = await Promise.all(createImageObjects)
        CanvasImageContext.dispatch({ action: 'INIT_IMAGE', data: imageObjects })
      } catch {
        console.error('🚨 fail to upload image from archive DB')
      }
    } else {
      CanvasImageContext.dispatch({ action: 'INIT_IMAGE', data: [] })
    }
  }

  subscribeContext() {
    ArchiveContext.subscribe({
      action: 'SET_SESSION_ID',
      effect: (context) => {
        const sid = context.state.sid
        this.fetchArchive(sid)
      },
    })
    CanvasImageContext.subscribe({
      action: 'INIT_IMAGE',
      effect: () => {
        this.paintImagesWithAnchor()
      },
    })
    CanvasImageContext.subscribe({
      action: 'PUSH_IMAGE',
      effect: () => {
        this.paintImagesWithAnchor()
      },
    })
    CanvasImageContext.subscribe({
      action: 'DELETE_IMAGE',
      effect: () => {
        this.resetInteractionAndPaint()
      },
    })
    CanvasImageContext.subscribe({
      action: 'CLEAR_IMAGE',
      effect: () => {
        this.paintImagesWithAnchor()
      },
    })
    CanvasImageContext.subscribe({
      action: 'SELECT_IMAGE',
      effect: () => {
        this.paintImagesWithAnchor()
      },
    })
  }

  subscribeEventBus() {
    const onImageUpload = async (dataUrls: string[]) => {
      const jobs = dataUrls.map(async (dataUrl) => {
        const image = await createImageObject({ dataUrl, topLeftPoint: { x: 50, y: 50 } })
        const rescaled = refineImageScale(
          { ref: this.$root },
          { width: image.width, height: image.height }
        )

        image.width = rescaled.width
        image.height = rescaled.height

        CanvasImageContext.dispatch({ action: 'PUSH_IMAGE', data: image })
      })

      try {
        await Promise.all(jobs)
      } catch {
        console.error('🚨 fail to upload image')
      }
    }
    const onClearAll = () => {
      this.focused = null
      CanvasImageContext.dispatch({ action: 'CLEAR_IMAGE' })
    }

    EventBus.getInstance().on(EVENT_KEY.UPLOAD_IMAGE, onImageUpload)
    EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, onClearAll)
  }

  setFocusedImage(image: ImageObject, point: Point) {
    this.focused = { image, anchors: [], point }
  }

  resetFocusedImage() {
    this.focused = null
  }

  setTransformType(type: ImageTransform) {
    this.transformType = type
  }

  resetTransformType() {
    this.transformType = null
  }

  listenSiblingLayerEvent(ev: Event) {
    if (!this.isActivePhase) {
      return
    }

    switch (ev.type) {
      case 'mousedown':
      case 'touchstart':
        this.handleTouchStart(ev)
        break
      case 'mousemove':
      case 'touchmove':
        this.handleTouchMove(ev)
        break
      case 'mouseup':
      case 'touchend':
        this.handleTouchEnd()
        break
      default:
        break
    }
  }

  handleTouchStart(ev: Event) {
    this.isPressed = true
    this.touch(ev as MouseEvent)
  }

  handleTouchMove(ev: Event) {
    if (this.isPressed) {
      this.moveWithPressed(ev as MouseEvent | TouchEvent)
    }
    if (!isTouchEvent(ev)) {
      this.hover(ev as MouseEvent)
    }
  }

  handleTouchEnd() {
    this.isPressed = false

    // if user click inside image
    if (this.focused?.point) {
      this.focused.point = null
    }

    // if user click image delete anchor
    if (this.transformType === 'DELETE') {
      const imageId = this.focused?.image.id
      if (imageId) {
        this.deleteImage(imageId)
      }
    }
  }

  private deleteImage(imageId: string) {
    CanvasImageContext.dispatch({ action: 'DELETE_IMAGE', data: imageId })
  }

  touch(ev: MouseEvent | TouchEvent) {
    const touchPoint = getSyntheticTouchPoint(this.$root, ev)
    const imageIndex = this.findTouchedImage(touchPoint)
    const anchor = this.findTouchedAnchor(touchPoint)

    if (anchor) {
      this.onTouchAnchorArea(anchor)
    } else if (imageIndex > -1) {
      this.onTouchImageArea(imageIndex, touchPoint)
    } else {
      this.onTouchBlurArea()
    }
  }

  findTouchedImage(point: Point) {
    const index = findLastIndexOf(this.images, (image) =>
      isPointInsideRect({
        pivot: {
          sx: image.sx,
          sy: image.sy,
          width: image.width,
          height: image.height,
          degree: image.degree,
        },
        pos: point,
      })
    )

    return index
  }

  findTouchedAnchor(point: Point) {
    if (!this.focused) {
      return
    }

    return findAnchorInPath({
      context: this.context,
      anchors: this.focused.anchors,
      point,
    })
  }

  onTouchImageArea(imageIndex: number, touchPoint: Point) {
    const image = this.images[imageIndex]
    this.setFocusedImage(image, touchPoint)
    CanvasImageContext.dispatch({ action: 'SELECT_IMAGE', data: imageIndex })
  }

  onTouchAnchorArea(anchor: Anchor) {
    this.setTransformType(anchor.type)
  }

  onTouchBlurArea() {
    this.resetInteractionAndPaint()
  }

  private resetInteractionAndPaint() {
    this.resetFocusedImage()
    this.resetTransformType()
    this.paintImagesWithAnchor()
  }

  hover(ev: MouseEvent) {
    if (this.focused) {
      const touchPoint = getSyntheticTouchPoint(this.$root, ev)

      const anchor = findAnchorInPath({
        context: this.context,
        anchors: this.focused.anchors,
        point: touchPoint,
      })

      if (anchor) {
        setMouseCursor(MOUSE_CURSOR[anchor.type])
        return
      }
    }

    setMouseCursor('default')
  }

  moveWithPressed(ev: MouseEvent | TouchEvent) {
    ev.preventDefault()

    if (this.focused?.point) {
      this.dragImage(ev)
    } else if (this.transformType === 'RESIZE') {
      this.resizeImage(ev)
    } else if (this.transformType === 'ROTATE') {
      this.rotateImage(ev)
    }
  }

  private dragImage(ev: MouseEvent | TouchEvent) {
    if (!this.focused?.point) {
      return
    }

    const { x, y } = getSyntheticTouchPoint(this.$root, ev)
    const dragImage = this.focused.image
    const dragstart = this.focused.point

    const dx = x - dragstart.x
    const dy = y - dragstart.y

    dragImage.sx += dx
    dragImage.sy += dy

    dragstart.x = x
    dragstart.y = y

    this.paintImagesWithAnchor()
  }

  private resizeImage(ev: MouseEvent | TouchEvent) {
    if (!this.focused || !this.transformType) {
      return
    }

    const touchPoint = getSyntheticTouchPoint(this.$root, ev)
    const image = this.focused.image

    const resizedBoundingRect = resizeRect({
      type: 'BOTTOM_RIGHT',
      originalBoundingRect: {
        sx: image.sx,
        sy: image.sy,
        width: image.width,
        height: image.height,
        degree: image.degree,
      },
      vectorTerminalPoint: touchPoint,
    })

    image.sx = resizedBoundingRect.sx
    image.sy = resizedBoundingRect.sy
    image.width = resizedBoundingRect.width
    image.height = resizedBoundingRect.height

    this.paintImagesWithAnchor()
  }

  private rotateImage(ev: MouseEvent | TouchEvent) {
    if (!this.focused || !this.transformType) {
      return
    }

    const touchPoint = getSyntheticTouchPoint(this.$root, ev)
    const image = this.focused.image
    const vertices = getBoundingRectVertices({
      topLeftPoint: { x: image.sx, y: image.sy },
      width: image.width,
      height: image.height,
    })
    const center = getCenterOfBoundingRect(vertices)
    const degree = getBearingDegree({ begin: center, end: touchPoint })
    image.degree = degree

    this.paintImagesWithAnchor()
  }

  private paintImagesWithAnchor() {
    clearCanvas(this.$root)

    this.paintImages()
    this.paintFocusedImageAnchorBorder()
  }

  private paintImages() {
    this.images.forEach(({ ref, sx, sy, width, height, degree }) => {
      if (!ref) {
        return
      }

      this.context.save()
      const center = getCenterOfBoundingRect(
        getBoundingRectVertices({ topLeftPoint: { x: sx, y: sy }, width, height })
      )
      this.context.translate(center.x, center.y)
      this.context.rotate(degreeToRadian(degree))
      this.context.translate(-center.x, -center.y)
      this.context.drawImage(ref, sx, sy, width, height)
      this.context.restore()
    })
  }

  private paintFocusedImageAnchorBorder() {
    if (!this.focused) {
      return
    }

    const { width, height, sx, sy, degree } = this.focused.image
    const anchors = drawAnchorBorder({
      context: this.context,
      size: { width, height },
      topLeftPoint: { x: sx, y: sy },
      degree,
    })
    this.focused.anchors = filterNullish(anchors)
  }
}

function drawAnchorBorder({
  context,
  topLeftPoint,
  size,
  degree,
}: {
  context: CanvasRenderingContext2D
  topLeftPoint: Point
  size: { width: number; height: number }
  degree: number
}): Anchor[] {
  const vertices = getRotatedBoundingRectVertices({
    vertices: getBoundingRectVertices({
      topLeftPoint,
      width: size.width,
      height: size.height,
    }),
    degree,
  })

  drawRect({
    context,
    vertices,
    color: 'rgba(151, 222, 255, 0.7)',
  })

  const deleteAnchorPath2d = drawDeleteAnchor({ context, point: vertices.ne })
  const rotateAnchorPath2d = drawRotateAnchor({
    context,
    point: get2dMiddlePoint(vertices.ne, vertices.nw),
  })
  const resizeAnchorPath2d = drawResizeAnchor({ context, point: vertices.se })

  const anchors: Anchor[] = [
    { type: 'DELETE', path2d: deleteAnchorPath2d },
    { type: 'RESIZE', path2d: resizeAnchorPath2d },
    { type: 'ROTATE', path2d: rotateAnchorPath2d },
  ]

  return anchors
}

function findAnchorInPath({
  context,
  anchors,
  point,
}: {
  context: CanvasRenderingContext2D
  anchors: Anchor[]
  point: Point
}) {
  return anchors.find((anchor) => context.isPointInPath(anchor.path2d, point.x, point.y))
}

function drawDeleteAnchor({ context, point }: { context: CanvasRenderingContext2D; point: Point }) {
  const ANCHOR_RADIUS = 26

  const path2d = drawCircle({
    context,
    centerPoint: point,
    radius: ANCHOR_RADIUS,
    color: 'rgba(28,39,76, 0.6)',
  })
  drawCrossLine({ context, centerPoint: point, lineLength: ANCHOR_RADIUS - 4 })

  return path2d
}

function drawResizeAnchor({ context, point }: { context: CanvasRenderingContext2D; point: Point }) {
  const ANCHOR_RADIUS = 26

  const path2d = drawCircle({
    context,
    centerPoint: point,
    radius: ANCHOR_RADIUS,
    color: 'rgba(28,39,76, 0.6)',
  })
  drawDiagonalArrow({ context, centerPoint: point, lineLength: ANCHOR_RADIUS - 4 })

  return path2d
}

function drawRotateAnchor({ context, point }: { context: CanvasRenderingContext2D; point: Point }) {
  const ANCHOR_RADIUS = 26
  const ARC_RADIUS = ANCHOR_RADIUS - 14

  const path2d = drawCircle({
    context,
    centerPoint: point,
    radius: ANCHOR_RADIUS,
    color: 'rgba(28,39,76, 0.6)',
  })
  drawArc({
    context,
    center: point,
    radius: ARC_RADIUS,
    startAngle: 0.3,
    endAngle: 1.8 * Math.PI,
  })
  drawSECramp({
    context,
    from: { x: point.x + ARC_RADIUS, y: point.y - 5 },
    lineLength: 8,
    lineWidth: 3,
    color: '#f8f8f8',
  })

  return path2d
}
