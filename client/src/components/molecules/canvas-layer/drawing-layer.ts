import { VComponent } from '@/modules/v-component'
import { PALETTE_COLORS } from '@/modules/canvas-engine/constant'
import { Z_INDEX } from '@/utils/constant'
import { CanvasDrawingContext, CanvasMetaContext, ArchiveContext } from '@/contexts'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { lastOf } from '@/utils/ramda'
import {
  get2dMiddlePoint,
  getSyntheticTouchPoint,
  takeSnapshot,
  reflectSnapshot,
  clearCanvas,
  refineCanvasRatioForRetinaDisplay,
} from '@/modules/canvas-engine'
import { getArchive } from '@/services/archive'
import type { Point } from '@/modules/canvas-engine/types'

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

  get sid() {
    return ArchiveContext.state.sid!
  }

  get title() {
    return CanvasMetaContext.state.title
  }

  get phase() {
    return CanvasMetaContext.state.phase
  }

  get snapshots() {
    return CanvasDrawingContext.state.snapshots
  }

  get pencilColor() {
    return PALETTE_COLORS[CanvasDrawingContext.state.pencilColor]
  }

  get strokeSize() {
    return CanvasDrawingContext.state.strokeSize
  }

  get isActivePhase() {
    return ['draw', 'erase'].includes(this.phase)
  }

  get canvas() {
    return this.$root
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
      const snapshots = data.snapshot ? [data.snapshot] : []
      CanvasDrawingContext.dispatch({ action: 'HISTORY_INIT', data: snapshots })
    } else {
      CanvasDrawingContext.dispatch({ action: 'HISTORY_INIT', data: [] })
    }
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
    ArchiveContext.subscribe({
      action: 'SET_SESSION_ID',
      effect: (context) => {
        const sid = context.state.sid
        this.fetchArchive(sid)
      },
    })
    CanvasDrawingContext.subscribe({
      action: 'HISTORY_INIT',
      effect: (context) => {
        const snapshot = lastOf(context.state.snapshots)

        if (snapshot) {
          reflectSnapshot(this.$root, snapshot)
        } else {
          clearCanvas(this.$root)
        }
      },
    })
    CanvasDrawingContext.subscribe({
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
    CanvasDrawingContext.subscribe({
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
    CanvasDrawingContext.subscribe({
      action: 'SET_PENCIL_COLOR',
      effect: (context) => {
        this.context.strokeStyle = context.state.pencilColor
      },
    })
    CanvasDrawingContext.subscribe({
      action: 'SET_STROKE_SIZE',
      effect: (context) => {
        this.context.lineWidth = context.state.strokeSize
      },
    })
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, () => {
      clearCanvas(this.$root)
      CanvasDrawingContext.dispatch({ action: 'CLEAR_ALL' })
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
      this.context.lineCap = 'round'
      this.context.strokeStyle = this.pencilColor
      this.context.lineWidth = this.strokeSize
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
        CanvasDrawingContext.dispatch({ action: 'PUSH_SNAPSHOT', data: [snapshot] })
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
