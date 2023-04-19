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
  private draggedImage: DragTarget | null = null
  private draggedIndex = -1
  private controlledIndex = -1

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
        this.touch(ev as MouseEvent)
        break
      case 'mousemove':
      case 'touchmove':
        this.draggedImage && this.drag(ev as MouseEvent | TouchEvent)
        break
      case 'mouseup':
      case 'touchend':
        this.draggedImage = null
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
        this.draggedIndex = -1
        this.draggedImage = null
        this.images = []
        this.paintImages()
      }

      EventBus.getInstance().on(EVENT_KEY.UPLOAD_IMAGE, onImageUpload)
      EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, onClearAll)
    }

    refineCanvasRatio(this.$canvas)
    subscribeEventBus()
  }

  touch(ev: MouseEvent | TouchEvent) {
    const setControlledImage = (index: number) => {
      this.controlledIndex = index
      this.paintImageControlBorder()
    }

    const setDraggedImage = (index: number, sx: number, sy: number) => {
      this.draggedIndex = index
      this.draggedImage = { sx, sy, image: this.images[index] }
    }

    const resetDraggedImage = () => {
      this.draggedIndex = -1
      this.draggedImage = null
    }

    const setDraggableImageObjectAtTouchPoint = () => {
      const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)

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

      if (index > -1) {
        setDraggedImage(index, x, y)
        setControlledImage(index)
      } else {
        resetDraggedImage()
      }
    }

    setDraggableImageObjectAtTouchPoint()
  }

  drag(ev: MouseEvent | TouchEvent) {
    const paint = () => {
      if (!this.draggedImage) {
        return
      }

      const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)
      const dx = x - this.draggedImage.sx
      const dy = y - this.draggedImage.sy

      const draggedImageEntity = this.images[this.draggedIndex]
      draggedImageEntity.sx += dx
      draggedImageEntity.sy += dy

      this.draggedImage.sx = x
      this.draggedImage.sy = y

      this.paintImages()
      this.paintImageControlBorder()
    }

    paint()
  }

  private paintImages() {
    clearCanvas(this.$canvas)

    this.images.forEach(({ ref, sx, sy, width, height }) => {
      if (ref) {
        this.context.drawImage(ref, sx, sy, width, height)
      }
    })
  }

  private paintImageControlBorder() {
    const { width, height, sx, sy } = this.images[this.controlledIndex]

    drawAnchorBorder({
      canvas: this.$canvas,
      size: { width, height },
      position: { sx, sy },
    })
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
  drawAnchor({ canvas, corners })
}

interface DrawBorderProps {
  canvas: HTMLCanvasElement
  corners: [number, number][]
  start: { x: number; y: number }
}

function drawBorder({ canvas, corners, start }: DrawBorderProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  const path = new Path2D()
  path.moveTo(start.x, start.y)
  path.lineTo(...corners[1])
  path.lineTo(...corners[2])
  path.lineTo(...corners[3])
  path.lineTo(...corners[0])

  context.strokeStyle = 'rgba(151, 222, 255, 0.7)'
  context.lineWidth = 5
  context.lineCap = 'round'
  context.stroke(path)
}

interface DrawAnchorProps {
  canvas: HTMLCanvasElement
  corners: [number, number][]
}

function drawAnchor({ canvas, corners }: DrawAnchorProps) {
  corners.forEach(([x, y]) => drawCircle({ canvas, position: { x, y }, radius: 10 }))
}

interface DrawCircleProps {
  canvas: HTMLCanvasElement
  position: { x: number; y: number }
  radius: number
  fill?: boolean
}

function drawCircle({ canvas, position, radius, fill = true }: DrawCircleProps) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.beginPath()
  context.arc(position.x, position.y, radius, 0, Math.PI * 2)
  if (fill) {
    context.fillStyle = '#ffffff'
    context.fill()
  }
  context.stroke()
}
