import { EventBus, EVENT_KEY } from '@/event-bus'
import { CanvasContext } from '@/contexts'
import { Z_INDEX } from '@/utils/constant'
import {
  getSyntheticTouchPoint,
  refineCanvasRatio,
  clearCanvas,
  isPointInsideRect,
  refineImageScale,
  createImageObject,
  resizeRect,
  drawCircle,
  drawLine,
} from './canvas.utils'
import type { ImageObject, DragTarget, Point, Resize, Anchor } from './canvas.types'
import { filterNullish } from '@/utils/ramda'
import { setDeviceCursor } from '@/utils/device'

/** @reference https://developer.mozilla.org/en-US/docs/Web/CSS/cursor */
const MOUSE_CURSOR: Record<Anchor['type'], string> = {
  TOP_LEFT: 'nw-resize',
  TOP_RIGHT: 'ne-resize',
  BOTTOM_LEFT: 'sw-resize',
  BOTTOM_RIGHT: 'se-resize',
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

export default class VCanvasImageLayer extends HTMLElement {
  private $root!: ShadowRoot
  private $canvas!: HTMLCanvasElement
  private context!: CanvasRenderingContext2D
  private images: ImageObject[] = []
  private dragged: { index: number; target: DragTarget | null } = { index: -1, target: null }
  private focused: { index: number; anchors: Anchor[] } | null = null
  private transformType: Anchor['type'] | null = null
  private isPressed = false

  static tag = 'v-canvas-image-layer'

  get phase() {
    return CanvasContext.state.phase
  }

  get isActivePhase() {
    return ['cursor', 'gallery'].includes(this.phase)
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initCanvas = () => {
      this.$canvas = this.$root.getElementById('image-layer') as HTMLCanvasElement
      const ctx = this.$canvas.getContext('2d')
      if (!ctx) {
        throw new Error('🚨 canvas load fail')
      }
      this.context = ctx
    }

    super()
    initShadowRoot()
    initCanvas()
  }

  connectedCallback() {
    const subscribeEventBus = () => {
      const onImageUpload = async (dataUrls: string[]) => {
        const jobs = dataUrls.map(async (dataUrl) => {
          const image = await createImageObject({ dataUrl, topLeftPoint: { x: 50, y: 50 } })
          const rescaled = refineImageScale(
            { ref: this.$canvas },
            { width: image.width, height: image.height }
          )

          image.width = rescaled.width
          image.height = rescaled.height

          this.images.push(image)
          this.paintImages()
        })

        try {
          await Promise.all(jobs)
        } catch {
          console.error('🚨 fail to upload image')
        }
      }
      const onClearAll = () => {
        this.images = []
        this.dragged = { index: -1, target: null }
        this.paintImages()
      }

      EventBus.getInstance().on(EVENT_KEY.UPLOAD_IMAGE, onImageUpload)
      EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, onClearAll)
    }

    refineCanvasRatio(this.$canvas)
    subscribeEventBus()
  }

  setFocusedImage(index: number) {
    this.focused = { index, anchors: [] }
    this.paintFocusedImageAnchorBorder()
  }

  resetFocusedImage() {
    this.focused = null
    this.paintImages()
  }

  setDraggedImage(index: number, { x, y }: Point) {
    this.dragged = { index, target: { sx: x, sy: y, image: this.images[index] } }
  }

  resetDraggedImage() {
    this.dragged = { index: -1, target: null }
  }

  setTransformType(type: Anchor['type']) {
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
        this.isPressed = true
        this.touch(ev as MouseEvent)
        break
      case 'mousemove':
      case 'touchmove':
        this.isPressed && this.moveWithPressed(ev as MouseEvent | TouchEvent)
        this.hover(ev as MouseEvent | TouchEvent) // TODO: cursor 가 있는 디바이스에서만 적용되도록 하기
        break
      case 'mouseup':
      case 'touchend':
        this.isPressed = false
        this.resetDraggedImage()
        break
      default:
        break
    }
  }

  touch(ev: MouseEvent | TouchEvent) {
    const findTouchedImage = (point: Point) => {
      /** FIXME: 뒤쪽에서부터 찾도록 변경 필요함 (이미지 겹쳐있는 경우 더 위에 위치한 이미지를 옮겨야하기 때문에) */
      const index = this.images.findIndex((image) =>
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

    const findTouchedAnchor = (point: Point) => {
      if (!this.focused) {
        return
      }

      return findAnchorInPath({
        context: this.context,
        anchors: this.focused.anchors,
        point,
      })
    }

    const touchPoint = getSyntheticTouchPoint(this.$canvas, ev)

    const imageIndex = findTouchedImage(touchPoint)
    const anchor = findTouchedAnchor(touchPoint)

    const isImageArea = imageIndex > -1
    if (isImageArea) {
      this.setDraggedImage(imageIndex, touchPoint)
      this.setFocusedImage(imageIndex)
    } else if (anchor) {
      this.setTransformType(anchor.type)
    } else {
      this.resetDraggedImage()
      this.resetFocusedImage()
      this.resetTransformType()
    }
  }

  hover(ev: MouseEvent | TouchEvent) {
    if (this.focused) {
      const touchPoint = getSyntheticTouchPoint(this.$canvas, ev)

      const anchor = findAnchorInPath({
        context: this.context,
        anchors: this.focused.anchors,
        point: touchPoint,
      })

      if (anchor) {
        setDeviceCursor(MOUSE_CURSOR[anchor.type])
        return
      }
    }

    setDeviceCursor('default')
  }

  moveWithPressed(ev: MouseEvent | TouchEvent) {
    if (this.dragged.target) {
      this.dragImage(ev)
      this.paintImages()
    } else if (this.focused) {
      this.resizeImage(ev)
      this.paintImages()
    }
  }

  private dragImage(ev: MouseEvent | TouchEvent) {
    if (!this.dragged.target) {
      return
    }

    const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)
    const dx = x - this.dragged.target.sx
    const dy = y - this.dragged.target.sy

    const draggedImageEntity = this.images[this.dragged.index]
    draggedImageEntity.sx += dx
    draggedImageEntity.sy += dy

    this.dragged.target.sx = x
    this.dragged.target.sy = y
  }

  private resizeImage(ev: MouseEvent | TouchEvent) {
    if (!this.focused || !this.transformType) {
      return
    }

    const touchPoint = getSyntheticTouchPoint(this.$canvas, ev)
    const image = this.images[this.focused.index]

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
    clearCanvas(this.$canvas)

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

    const { width, height, sx, sy } = this.images[this.focused.index]
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

  drawBorder({
    context,
    corners: Object.values(corners),
    start: { x: topLeftPoint.x, y: topLeftPoint.y },
  })

  const anchorTypes = Object.keys(corners) as Resize[]
  const anchorPath2ds = drawAnchor({ context, corners: Object.values(corners) })
  const anchors = anchorPath2ds.map((path2d, index) => ({ type: anchorTypes[index], path2d }))

  return anchors
}

function drawBorder({
  context,
  corners,
  start,
}: {
  context: CanvasRenderingContext2D
  corners: Point[]
  start: Point
}) {
  drawLine({
    context,
    from: { x: start.x, y: start.y },
    to: { x: corners[1].x, y: corners[1].y },
  })
  drawLine({
    context,
    from: { x: corners[1].x, y: corners[1].y },
    to: { x: corners[2].x, y: corners[2].y },
  })
  drawLine({
    context,
    from: { x: corners[2].x, y: corners[2].y },
    to: { x: corners[3].x, y: corners[3].y },
  })
  drawLine({
    context,
    from: { x: corners[3].x, y: corners[3].y },
    to: { x: corners[0].x, y: corners[0].y },
  })
}

function drawAnchor({ context, corners }: { context: CanvasRenderingContext2D; corners: Point[] }) {
  return corners.map((point) => drawCircle({ context, point, radius: 10 }))
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
