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
} from './canvas.utils'
import type { ImageObject, DragTarget, Point, Resize } from './canvas.types'
import { filterNullish } from '@/utils/ramda'

interface Anchor {
  type: Resize
  path2d: Path2D
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
        this.isPressed && this.move(ev as MouseEvent | TouchEvent)
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

  connectedCallback() {
    const subscribeEventBus = () => {
      const onImageUpload = async (dataUrls: string[]) => {
        const jobs = dataUrls.map(async (dataUrl) => {
          const image = await createImageObject({ dataUrl }, { sx: 50, sy: 50 })
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

  setDraggedImage(index: number, sx: number, sy: number) {
    this.dragged = { index, target: { sx, sy, image: this.images[index] } }
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

  touch(ev: MouseEvent | TouchEvent) {
    const findTouchedImage = (x: number, y: number) => {
      /** FIXME: 뒤쪽에서부터 찾도록 변경 필요함 (이미지 겹쳐있는 경우 더 위에 위치한 이미지를 옮겨야하기 때문에) */
      const index = this.images.findIndex((image) =>
        isPointInsideRect({
          pivot: {
            sx: image.sx,
            sy: image.sy,
            width: image.width,
            height: image.height,
          },
          pos: { x, y },
        })
      )

      return index
    }

    const findTouchedAnchor = ({ x, y }: Point) => {
      if (!this.focused) {
        return
      }

      return findAnchorInPath({
        context: this.context,
        anchors: this.focused.anchors,
        position: { x, y },
      })
    }

    const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)

    const imageIndex = findTouchedImage(x, y)
    const anchor = findTouchedAnchor({ x, y })

    const isImageArea = imageIndex > -1
    if (isImageArea) {
      this.setDraggedImage(imageIndex, x, y)
      this.setFocusedImage(imageIndex)
    } else if (anchor) {
      this.setTransformType(anchor.type)
    } else {
      this.resetDraggedImage()
      this.resetFocusedImage()
      this.resetTransformType()
    }
  }

  move(ev: MouseEvent | TouchEvent) {
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

    const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)
    const image = this.images[this.focused.index]

    const resizedBoundingRect = resizeRect({
      type: this.transformType,
      originalBoundingRect: {
        sx: image.sx,
        sy: image.sy,
        width: image.width,
        height: image.height,
      },
      vectorTerminalPoint: { x, y },
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
      position: { sx, sy },
    })
    this.focused.anchors = filterNullish(anchors)
  }
}

interface DrawAnchorBorderProps {
  context: CanvasRenderingContext2D
  position: { sx: number; sy: number }
  size: { width: number; height: number }
}

function drawAnchorBorder({ context, position, size }: DrawAnchorBorderProps): Anchor[] {
  const corners: Record<Resize, [number, number]> = {
    TOP_LEFT: [position.sx, position.sy],
    TOP_RIGHT: [position.sx + size.width, position.sy],
    BOTTOM_RIGHT: [position.sx + size.width, position.sy + size.height],
    BOTTOM_LEFT: [position.sx, position.sy + size.height],
  }

  drawBorder({
    context,
    corners: Object.values(corners),
    start: { x: position.sx, y: position.sy },
  })

  const anchorTypes = Object.keys(corners) as Resize[]
  const anchorPath2ds = drawAnchor({ context, corners: Object.values(corners) })
  const anchors = anchorPath2ds.map((path2d, index) => ({ type: anchorTypes[index], path2d }))

  return anchors
}

interface DrawBorderProps {
  context: CanvasRenderingContext2D
  corners: [number, number][]
  start: { x: number; y: number }
}

function drawBorder({ context, corners, start }: DrawBorderProps) {
  drawLine({
    context,
    from: { x: start.x, y: start.y },
    to: { x: corners[1][0], y: corners[1][1] },
  })
  drawLine({
    context,
    from: { x: corners[1][0], y: corners[1][1] },
    to: { x: corners[2][0], y: corners[2][1] },
  })
  drawLine({
    context,
    from: { x: corners[2][0], y: corners[2][1] },
    to: { x: corners[3][0], y: corners[3][1] },
  })
  drawLine({
    context,
    from: { x: corners[3][0], y: corners[3][1] },
    to: { x: corners[0][0], y: corners[0][1] },
  })
}

interface DrawLineProps {
  context: CanvasRenderingContext2D
  from: { x: number; y: number }
  to: { x: number; y: number }
}

function drawLine({ context, from, to }: DrawLineProps) {
  const path = new Path2D()
  path.moveTo(from.x, from.y)
  path.lineTo(to.x, to.y)

  context.strokeStyle = 'rgba(151, 222, 255)'
  context.lineWidth = 5
  context.lineCap = 'round'
  context.stroke(path)

  return path
}

interface DrawAnchorProps {
  context: CanvasRenderingContext2D
  corners: [number, number][]
}

function drawAnchor({ context, corners }: DrawAnchorProps) {
  return corners.map(([x, y]) => drawCircle({ context, position: { x, y }, radius: 10 }))
}

interface DrawCircleProps {
  context: CanvasRenderingContext2D
  position: { x: number; y: number }
  radius: number
}

function drawCircle({ context, position, radius }: DrawCircleProps) {
  const path = new Path2D()
  path.arc(position.x, position.y, radius, 0, Math.PI * 2)
  context.fillStyle = 'rgba(151, 222, 255)'
  context.fill(path)

  return path
}

interface findAnchorInPathProps {
  context: CanvasRenderingContext2D
  anchors: Anchor[]
  position: { x: number; y: number }
}

function findAnchorInPath({ context, anchors, position }: findAnchorInPathProps) {
  return anchors.find((anchor) => context.isPointInPath(anchor.path2d, position.x, position.y))
}
