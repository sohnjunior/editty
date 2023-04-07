import { Z_INDEX } from '@/utils/constant'
import { CanvasContext } from '@/contexts'
import { lastOf } from '@/utils/ramda'
import {
  getMiddlePoint,
  getSnapshot,
  getSyntheticTouchPoint,
  setSnapshot,
  fillBackgroundColor,
  clearCanvas,
} from './canvas.utils'
import type { PencilPoint } from './canvas.types'

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
      /** FIXME: mouseleave 로 인해 호출된 경우에는 그리기 동작 수행중에 캔버스 벗어난 경우에만 스냅샷 저장하도록 수정 필요 */
      // this.addEventListener('mouseleave', this.cleanup)

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

    const subscribeContext = () => {
      CanvasContext.subscribe({
        action: 'POP_SNAPSHOT',
        effect: (context) => {
          const snapshot = lastOf(context.state.snapshots)

          console.log(context.state.snapshots)
          if (snapshot) {
            setSnapshot(this.$canvas, snapshot)
          } else {
            clearCanvas(this.$canvas)
          }
        },
      })

      CanvasContext.subscribe({
        action: 'PUSH_SNAPSHOT',
        effect: (context) => {
          console.log(context.state.snapshots)
        },
      })
    }

    initEvents()
    refineCanvasRatio()
    subscribeContext()
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

      if (this.phase === 'draw') {
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
