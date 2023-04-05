import { Z_INDEX } from '@/utils/constant'
import { CanvasContext } from '@/contexts'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host #canvas-container {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      position: relative;
    }

    :host #canvas-container > canvas {
      width: 100%;
      height: 100%;
    }

    :host #background-layer {
      background-color: #f8f8f8;
      z-index: ${Z_INDEX.CANVAS_LAYER.BACKGROUND};
      position: absolute;
    }

    :host #drawing-layer {
      z-index: ${Z_INDEX.CANVAS_LAYER.DRAWING};
      position: absolute;
    }
  </style>
  <div id="canvas-container">
    <canvas id="background-layer"></canvas>
    <canvas id="drawing-layer"></canvas>
  </div>
`

interface PencilPoint {
  x: number
  y: number
}

export default class VCanvas extends HTMLElement {
  private $root!: ShadowRoot
  private $canvas!: HTMLCanvasElement
  private context!: CanvasRenderingContext2D
  private points: PencilPoint[] = []

  static tag = 'v-canvas'

  get phase() {
    return CanvasContext.state.phase
  }

  get snapshots() {
    return CanvasContext.state.snapshots
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initCanvas = () => {
      this.$canvas = this.$root.getElementById('drawing-layer') as HTMLCanvasElement
      const ctx = this.$canvas.getContext('2d')
      if (!ctx) {
        throw new Error('🚨 canvas load fail')
      }
      this.context = ctx

      this.context.fillStyle = '#f8f8f8'
      this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height)
    }

    super()
    initShadowRoot()
    initCanvas()
  }

  connectedCallback() {
    const initEvents = () => {
      this.addEventListener('mousedown', this.setup)
      this.addEventListener('mouseup', this.cleanup)
      this.addEventListener('mouseleave', this.cleanup)

      this.addEventListener('touchstart', this.setup)
      this.addEventListener('touchend', this.cleanup)
    }

    const refineCanvasRatio = () => {
      const ratio = window.devicePixelRatio
      const { width, height } = getComputedStyle(this.$canvas)

      this.$canvas.width = parseInt(width) * ratio
      this.$canvas.height = parseInt(height) * ratio

      fillBackgroundColor(this.$canvas, '#f8f8f8')
    }

    refineCanvasRatio()
    initEvents()
  }

  disconnectedCallback() {
    this.removeEventListener('mousemove', this.draw)
    this.removeEventListener('touchmove', this.draw)
  }

  setup() {
    const setupLineStyle = () => {
      this.context.lineWidth = 10
      this.context.lineCap = 'round'
      this.context.strokeStyle = '#ACD3ED'
    }

    const setupSnapshots = () => {
      if (this.snapshots.length > 0) {
        this.snapshots.forEach((snapshot) => setSnapshot(this.$canvas, snapshot))
      }
    }

    setupLineStyle()
    setupSnapshots()

    this.addEventListener('mousemove', this.draw)
    this.addEventListener('touchmove', this.draw)
  }

  cleanup() {
    const takeSnapshot = () => {
      /** FIXME: mouseleave 로 인해 호출된 경우에는 그리기 동작 수행중에 캔버스 벗어난 경우에만 스냅샷 저장하도록 수정 필요 */
      const snapshot = getSnapshot(this.$canvas)
      if (snapshot) {
        CanvasContext.dispatch({ action: 'PUSH_SNAPSHOT', data: [snapshot] })
      }
    }

    const resetPencilPoints = () => {
      this.points = []
    }

    takeSnapshot()
    resetPencilPoints()
    this.removeEventListener('mousemove', this.draw)
    this.removeEventListener('touchmove', this.draw)
  }

  draw(e: MouseEvent | TouchEvent) {
    e.preventDefault()

    const trackTouchPoint = () => {
      const { x, y } = getSyntheticTouchPoint(this.$canvas, e)
      this.points.push({ x, y })
    }

    const paint = () => {
      this.context.beginPath()

      if (this.phase === 'drawing') {
        this.context.globalCompositeOperation = 'source-over'
      } else {
        this.context.globalCompositeOperation = 'destination-out'
      }

      // we can insure coordinate is exist because paint is called after track touch point
      const { x: startX, y: startY } = this.points[0]
      this.context.moveTo(startX, startY)

      // draw smooth line with quadratic Bézier curve
      for (let idx = 1; idx < this.points.length - 1; idx += 1) {
        const endpoint = getMiddlePoint(this.points[idx], this.points[idx + 1])
        this.context.quadraticCurveTo(
          this.points[idx].x,
          this.points[idx].y,
          endpoint.x,
          endpoint.y
        )
      }

      this.context.stroke()
    }

    trackTouchPoint()
    paint()
  }
}

function isTouchEvent(e: unknown): e is TouchEvent {
  return window.TouchEvent && e instanceof TouchEvent
}

function getSyntheticTouchPoint(canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  if (isTouchEvent(e)) {
    // only deal with one finger touch
    const touch = e.touches[0]

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    }
  } else {
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }
}

function getMiddlePoint(p1: PencilPoint, p2: PencilPoint) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

function fillBackgroundColor(canvas: HTMLCanvasElement, color: string) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function getSnapshot(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function setSnapshot(canvas: HTMLCanvasElement, snapshot: ImageData) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.putImageData(snapshot, 0, 0)
}
