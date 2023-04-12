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

  listenExternalEvent(ev: Event) {
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
    const initEventBus = () => {
      const onImageUpload = async (dataUrls: string[]) => {
        const jobs = dataUrls.map(async (dataUrl) => {
          const image = await createImageObject({ dataUrl }, { sx: 50, sy: 50 })
          const calibration = refineImageScale(
            { ref: this.$canvas },
            { width: image.width, height: image.height }
          )

          image.width = calibration.width
          image.height = calibration.height

          this.images.push(image)
          this.paintImages()
        })

        try {
          await Promise.all(jobs)
        } catch {
          console.error('🚨 fail to upload image')
        }
      }

      EventBus.getInstance().on(EVENT_KEY.UPLOAD_IMAGE, onImageUpload)
    }

    refineCanvasRatio(this.$canvas)
    initEventBus()
  }

  touch(ev: MouseEvent | TouchEvent) {
    const { x, y } = getSyntheticTouchPoint(this.$canvas, ev)

    const setDraggableImageObjectAtTouchPoint = () => {
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
        this.draggedIndex = index
        this.draggedImage = { sx: x, sy: y, image: this.images[index] }
      } else {
        this.draggedIndex = -1
        this.draggedImage = null
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
    }

    paint()
  }

  paintImages() {
    clearCanvas(this.$canvas)

    this.images.forEach(({ ref, sx, sy, width, height }) => {
      if (ref) {
        this.context.drawImage(ref, sx, sy, width, height)
      }
    })
  }
}
