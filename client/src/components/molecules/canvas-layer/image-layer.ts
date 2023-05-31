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
  resizeRect,
  drawCircle,
  drawRect,
} from '@/modules/canvas-utils/engine'
import { Point } from '@/modules/canvas-utils/types'
import type { Resize, Anchor, ImageTransform, ImageObject } from './types'
import { getArchive } from '@/services/archive'
import { filterNullish, findLastIndexOf } from '@/utils/ramda'
import { setMouseCursor, isTouchEvent } from '@/utils/dom'

/** @reference https://developer.mozilla.org/en-US/docs/Web/CSS/cursor */
const MOUSE_CURSOR: Record<ImageTransform, string> = {
  TOP_LEFT: 'nwse-resize',
  TOP_RIGHT: 'nesw-resize',
  BOTTOM_LEFT: 'nesw-resize',
  BOTTOM_RIGHT: 'nwse-resize',
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
        this.paintImages()
      },
    })
    CanvasImageContext.subscribe({
      action: 'PUSH_IMAGE',
      effect: () => {
        this.paintImages()
      },
    })
    CanvasImageContext.subscribe({
      action: 'CLEAR_IMAGE',
      effect: () => {
        this.paintImages()
      },
    })
    CanvasImageContext.subscribe({
      action: 'SELECT_IMAGE',
      effect: () => {
        this.paintImages()
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
    if (this.focused) {
      this.focused.point = null
    }
  }

  touch(ev: MouseEvent | TouchEvent) {
    const touchPoint = getSyntheticTouchPoint(this.$root, ev)
    const imageIndex = this.findTouchedImage(touchPoint)
    const anchor = this.findTouchedAnchor(touchPoint)

    if (imageIndex > -1) {
      this.onTouchImageArea(imageIndex, touchPoint)
    } else if (anchor) {
      this.onTouchAnchorArea(anchor)
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
    this.resetFocusedImage()
    this.resetTransformType()
    this.paintImages()
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
      this.paintImages()
    } else if (this.focused) {
      this.resizeImage(ev)
      this.paintImages()
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
  }

  private resizeImage(ev: MouseEvent | TouchEvent) {
    if (!this.focused || !this.transformType) {
      return
    }

    const touchPoint = getSyntheticTouchPoint(this.$root, ev)
    const image = this.focused.image

    const resizedBoundingRect = resizeRect({
      type: this.transformType,
      originalBoundingRect: {
        sx: image.sx,
        sy: image.sy,
        width: image.width,
        height: image.height,
      },
      vectorTerminalPoint: touchPoint,
    })

    image.sx = resizedBoundingRect.sx
    image.sy = resizedBoundingRect.sy
    image.width = resizedBoundingRect.width
    image.height = resizedBoundingRect.height
  }

  private paintImages() {
    clearCanvas(this.$root)

    this.images.forEach(({ ref, sx, sy, width, height }) => {
      if (ref) {
        this.context.drawImage(ref, sx, sy, width, height)
      }
    })

    if (this.focused) {
      this.paintFocusedImageAnchorBorder()
    }
  }

  private paintFocusedImageAnchorBorder() {
    if (!this.focused) {
      return
    }

    const { width, height, sx, sy } = this.focused.image
    const anchors = drawAnchorBorder({
      context: this.context,
      size: { width, height },
      topLeftPoint: { x: sx, y: sy },
    })
    this.focused.anchors = filterNullish(anchors)
  }
}

function drawAnchorBorder({
  context,
  topLeftPoint,
  size,
}: {
  context: CanvasRenderingContext2D
  topLeftPoint: Point
  size: { width: number; height: number }
}): Anchor[] {
  const corners: Record<Resize, Point> = {
    TOP_LEFT: { x: topLeftPoint.x, y: topLeftPoint.y },
    TOP_RIGHT: { x: topLeftPoint.x + size.width, y: topLeftPoint.y },
    BOTTOM_RIGHT: { x: topLeftPoint.x + size.width, y: topLeftPoint.y + size.height },
    BOTTOM_LEFT: { x: topLeftPoint.x, y: topLeftPoint.y + size.height },
  }

  drawRect({
    context,
    corners: Object.values(corners),
  })

  const anchorTypes = Object.keys(corners) as Resize[]
  const anchorPath2ds = drawAnchor({ context, corners: Object.values(corners) })
  const anchors = anchorPath2ds.map((path2d, index) => ({ type: anchorTypes[index], path2d }))

  return anchors
}

function drawAnchor({ context, corners }: { context: CanvasRenderingContext2D; corners: Point[] }) {
  return corners.map((point) => drawCircle({ context, point, radius: 12 }))
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
