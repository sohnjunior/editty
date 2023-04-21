import { EventBus, EVENT_KEY } from '@/event-bus'
import { CanvasContext } from '@/contexts'
import { Z_INDEX } from '@/utils/constant'
import {
  getSyntheticTouchPoint,
  refineCanvasRatio,
  clearCanvas,
  isPointInsideRect,
  resizeImageScale,
  createImageObject,
} from './canvas.utils'
import type { ImageObject, DragTarget } from './canvas.types'
import { filterNullish } from '@/utils/ramda'

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
  private focused: { index: number; anchors: Path2D[] } | null = null
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
          const resized = resizeImageScale(
            { ref: this.$canvas },
            { width: image.width, height: image.height }
          )

          image.width = resized.width
          image.height = resized.height

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

    const isPointInsideAnchorArea = (x: number, y: number) => {
      if (!this.focused) {
        return false
      }
      return isInAnchorPath({
        canvas: this.$canvas,
        anchors: this.focused.anchors,
        position: { x, y },
      })
    }

    // const startTransformImage = (x, y) => {}

    const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)

    const index = findTouchedImage(x, y)
    const isPointInsideImageArea = index > -1
    if (isPointInsideImageArea) {
      this.setDraggedImage(index, x, y)
      this.setFocusedImage(index)
    } else if (isPointInsideAnchorArea(x, y)) {
      console.log('이미지 리사이즈 시작')
    } else {
      this.resetDraggedImage()
      this.resetFocusedImage()
    }
  }

  move(ev: MouseEvent | TouchEvent) {
    if (this.dragged.target) {
      /** 💡 drag image */
      const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)
      const dx = x - this.dragged.target.sx
      const dy = y - this.dragged.target.sy

      const draggedImageEntity = this.images[this.dragged.index]
      draggedImageEntity.sx += dx
      draggedImageEntity.sy += dy

      this.dragged.target.sx = x
      this.dragged.target.sy = y

      this.paintImages()
    } else if (this.focused) {
      /** 💡 resize image */
      console.log('선택된 상태에서 드래그')
    }
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
      canvas: this.$canvas,
      size: { width, height },
      position: { sx, sy },
    })
    this.focused.anchors = filterNullish(anchors)
  }
}

interface DrawAnchorBorderProps {
  canvas: HTMLCanvasElement
  position: { sx: number; sy: number }
  size: { width: number; height: number }
}

function drawAnchorBorder({ canvas, position, size }: DrawAnchorBorderProps) {
  const corners: [number, number][] = [
    [position.sx, position.sy],
    [position.sx + size.width, position.sy],
    [position.sx + size.width, position.sy + size.height],
    [position.sx, position.sy + size.height],
  ]

  drawBorder({ canvas, corners, start: { x: position.sx, y: position.sy } })
  const anchorPaths = drawAnchor({ canvas, corners })

  return anchorPaths
}

interface DrawBorderProps {
  canvas: HTMLCanvasElement
  corners: [number, number][]
  start: { x: number; y: number }
}

function drawBorder({ canvas, corners, start }: DrawBorderProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return []
  }

  drawLine({
    canvas,
    from: { x: start.x, y: start.y },
    to: { x: corners[1][0], y: corners[1][1] },
  })
  drawLine({
    canvas,
    from: { x: corners[1][0], y: corners[1][1] },
    to: { x: corners[2][0], y: corners[2][1] },
  })
  drawLine({
    canvas,
    from: { x: corners[2][0], y: corners[2][1] },
    to: { x: corners[3][0], y: corners[3][1] },
  })
  drawLine({
    canvas,
    from: { x: corners[3][0], y: corners[3][1] },
    to: { x: corners[0][0], y: corners[0][1] },
  })
}

interface DrawLineProps {
  canvas: HTMLCanvasElement
  from: { x: number; y: number }
  to: { x: number; y: number }
}

function drawLine({ canvas, from, to }: DrawLineProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

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
  canvas: HTMLCanvasElement
  corners: [number, number][]
}

function drawAnchor({ canvas, corners }: DrawAnchorProps) {
  return corners.map(([x, y]) => drawCircle({ canvas, position: { x, y }, radius: 10 }))
}

interface DrawCircleProps {
  canvas: HTMLCanvasElement
  position: { x: number; y: number }
  radius: number
}

function drawCircle({ canvas, position, radius }: DrawCircleProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  const path = new Path2D()
  path.arc(position.x, position.y, radius, 0, Math.PI * 2)
  context.fillStyle = 'rgba(151, 222, 255)'
  context.fill(path)

  return path
}

interface IsInAnchorPathProps {
  canvas: HTMLCanvasElement
  anchors: Path2D[]
  position: { x: number; y: number }
}

function isInAnchorPath({ canvas, anchors, position }: IsInAnchorPathProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return false
  }

  return anchors.some((anchor) => context.isPointInPath(anchor, position.x, position.y))
}
