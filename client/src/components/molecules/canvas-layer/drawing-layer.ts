import { VComponent } from '@/modules/v-component'
import { Z_INDEX } from '@/utils/constant'
import { CanvasContext } from '@/contexts'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { lastOf } from '@/utils/ramda'
import {
  get2dMiddlePoint,
  getSyntheticTouchPoint,
  takeSnapshot,
  reflectSnapshot,
  clearCanvas,
  refineCanvasRatioForRetinaDisplay,
} from '@/modules/canvas.utils'
import type { Point } from './types'

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

export default class VCanvasDrawingLayer extends VComponent<HTMLCanvasElement> {
  static tag = 'v-canvas-drawing-layer'
  private context!: CanvasRenderingContext2D
  private points: Point[] = []
  private isDrawing = false

  get phase() {
    return CanvasContext.state.phase
  }

  get snapshots() {
    return CanvasContext.state.snapshots
  }

  get pencilColor() {
    return CanvasContext.state.pencilColor
  }

  get isActivePhase() {
    return ['draw', 'erase'].includes(this.phase)
  }

  constructor() {
    const initCanvasContext = () => {
      const ctx = this.$root.getContext('2d')
      if (!ctx) {
        throw new Error('🚨 canvas load fail')
      }
      this.context = ctx
    }

    super(template)
    initCanvasContext()
  }

  afterCreated() {
    refineCanvasRatioForRetinaDisplay(this.$root)
  }

  bindEventListener() {
    this.addEventListener('mousedown', this.setup)
    this.addEventListener('mouseup', this.cleanup)
    this.addEventListener('mousemove', this.draw)
    /** FIXME: mouseleave 로 인해 호출된 경우에는 그리기 동작 수행중에 캔버스 벗어난 경우에만 스냅샷 저장하도록 수정 필요 */
    // this.addEventListener('mouseleave', this.cleanup)

    this.addEventListener('touchstart', this.setup)
    this.addEventListener('touchend', this.cleanup)
    this.addEventListener('touchmove', this.draw)
  }

  subscribeContext() {
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
          reflectSnapshot(this.$root, snapshot)
        } else {
          clearCanvas(this.$root)
        }
      },
    })
    CanvasContext.subscribe({
      action: 'HISTORY_FORWARD',
      effect: (context) => {
        const snapshot = lastOf(context.state.snapshots)

        if (snapshot) {
          reflectSnapshot(this.$root, snapshot)
        } else {
          clearCanvas(this.$root)
        }
      },
    })
    CanvasContext.subscribe({
      action: 'SET_PENCIL_COLOR',
      effect: (context) => {
        this.context.strokeStyle = context.state.pencilColor
      },
    })
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, () => {
      clearCanvas(this.$root)
      CanvasContext.dispatch({ action: 'CLEAR_ALL' })
    })
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
      this.context.strokeStyle = this.pencilColor
    }

    const setupSnapshots = () => {
      if (this.snapshots.length > 0) {
        this.snapshots.forEach((snapshot) => reflectSnapshot(this.$root, snapshot))
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

      const snapshot = takeSnapshot(this.$root)
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

  draw(ev: MouseEvent | TouchEvent) {
    if (!this.isDrawing) {
      return
    }

    this.trackTouchPoint(ev)
    this.paintPath()
  }

  private trackTouchPoint(ev: MouseEvent | TouchEvent) {
    ev.preventDefault()

    const { x, y } = getSyntheticTouchPoint(this.$root, ev)
    this.points.push({ x, y })
  }

  private paintPath() {
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
      const endpoint = get2dMiddlePoint(this.points[idx], this.points[idx + 1])
      this.context.quadraticCurveTo(this.points[idx].x, this.points[idx].y, endpoint.x, endpoint.y)
    }

    this.context.stroke()
  }
}
