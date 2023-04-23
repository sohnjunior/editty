import { Z_INDEX } from '@/utils/constant'
import { CanvasContext } from '@/contexts'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { lastOf } from '@/utils/ramda'
import {
  getMiddlePoint,
  getSyntheticTouchPoint,
  takeSnapshot,
  reflectSnapshot,
  clearCanvas,
  refineCanvasRatio,
} from './canvas.utils'
import type { Point } from './canvas.types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host #drawing-layer {
      width: 100%;
      height: 100%;
      z-index: ${Z_INDEX.CANVAS_LAYER.DRAWING};
      position: absolute;
    }
  </style>
  <canvas id="drawing-layer"></canvas>
`

export default class VCanvasDrawingLayer extends HTMLElement {
  private $root!: ShadowRoot
  private $canvas!: HTMLCanvasElement
  private context!: CanvasRenderingContext2D
  private points: Point[] = []
  private isDrawing = false

  static tag = 'v-canvas-drawing-layer'

  get phase() {
    return CanvasContext.state.phase
  }

  get snapshots() {
    return CanvasContext.state.snapshots
  }

  get isActivePhase() {
    return ['draw', 'erase'].includes(this.phase)
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
    }

    super()
    initShadowRoot()
    initCanvas()
  }

  connectedCallback() {
    const initEvents = () => {
      this.addEventListener('mousedown', this.setup)
      this.addEventListener('mouseup', this.cleanup)
      this.addEventListener('mousemove', this.draw)
      /** FIXME: mouseleave 로 인해 호출된 경우에는 그리기 동작 수행중에 캔버스 벗어난 경우에만 스냅샷 저장하도록 수정 필요 */
      // this.addEventListener('mouseleave', this.cleanup)

      this.addEventListener('touchstart', this.setup)
      this.addEventListener('touchend', this.cleanup)
      this.addEventListener('touchmove', this.draw)
    }

    const subscribeContext = () => {
      CanvasContext.subscribe({
        action: 'PUSH_SNAPSHOT',
        effect: (context) => {
          console.log(context.state.snapshots)
        },
      })
      CanvasContext.subscribe({
        action: 'HISTORY_BACK',
        effect: (context) => {
          const snapshot = lastOf(context.state.snapshots)

          if (snapshot) {
            reflectSnapshot(this.$canvas, snapshot)
          } else {
            clearCanvas(this.$canvas)
          }
        },
      })
      CanvasContext.subscribe({
        action: 'HISTORY_FORWARD',
        effect: (context) => {
          const snapshot = lastOf(context.state.snapshots)

          if (snapshot) {
            reflectSnapshot(this.$canvas, snapshot)
          } else {
            clearCanvas(this.$canvas)
          }
        },
      })
    }

    const subscribeEventBus = () => {
      EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, () => {
        clearCanvas(this.$canvas)
        CanvasContext.dispatch({ action: 'CLEAR_ALL' })
      })
    }

    initEvents()
    refineCanvasRatio(this.$canvas)
    subscribeContext()
    subscribeEventBus()
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this.setup)
    this.removeEventListener('mouseup', this.cleanup)
    this.removeEventListener('mousemove', this.draw)
    this.removeEventListener('touchstart', this.setup)
    this.removeEventListener('touchend', this.cleanup)
    this.removeEventListener('touchmove', this.draw)
  }

  setup() {
    if (!this.isActivePhase) {
      return
    }

    const setupLineStyle = () => {
      this.context.lineWidth = 10
      this.context.lineCap = 'round'
      this.context.strokeStyle = getComputedStyle(this.$canvas).getPropertyValue('--color-primary')
    }

    const setupSnapshots = () => {
      if (this.snapshots.length > 0) {
        this.snapshots.forEach((snapshot) => reflectSnapshot(this.$canvas, snapshot))
      }
    }

    this.isDrawing = true
    setupLineStyle()
    setupSnapshots()
  }

  cleanup() {
    if (!this.isActivePhase) {
      return
    }

    const takeCanvasSnapshot = () => {
      const hasPencilPoints = this.points.length > 0
      if (!hasPencilPoints) {
        return
      }

      const snapshot = takeSnapshot(this.$canvas)
      if (snapshot) {
        CanvasContext.dispatch({ action: 'PUSH_SNAPSHOT', data: [snapshot] })
      }
    }

    const resetPencilPoints = () => {
      this.points = []
    }

    this.isDrawing = false
    takeCanvasSnapshot()
    resetPencilPoints()
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing) {
      return
    }

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
