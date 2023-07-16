import { VComponent } from '@/modules/v-component'
import { clearCanvas } from '@/modules/canvas-engine'
import VCanvasBackgroundLayer from '@molecules/canvas-layer/background-layer'
import VCanvasImageLayer from '@molecules/canvas-layer/image-layer'
import VCanvasDrawingLayer from '@molecules/canvas-layer/drawing-layer'
import { getOneTimeSessionId } from '@/services/session'
import { addArchive, addOrUpdateArchive } from '@/services/archive'
import type { Archive } from '@/services/archive'
import { showToast } from '@/services/toast'
import { lastOf } from '@/utils/ramda'
import { CanvasDrawingContext, CanvasImageContext, ArchiveContext } from '@/contexts'
import { EventBus, EVENT_KEY } from '@/event-bus'

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
  </style>
  <div id="canvas-container">
    <v-canvas-background-layer></v-canvas-background-layer>
    <v-canvas-image-layer></v-canvas-image-layer>
    <v-canvas-drawing-layer></v-canvas-drawing-layer>
  </div>
`

export default class VCanvasContainer extends VComponent {
  static tag = 'v-canvas-container'
  private backgroundLayer!: VCanvasBackgroundLayer
  private imageLayer!: VCanvasImageLayer
  private drawingLayer!: VCanvasDrawingLayer

  constructor() {
    super(template)
  }

  get sid() {
    return ArchiveContext.state.sid!
  }

  get snapshots() {
    return CanvasDrawingContext.state.snapshots
  }

  get images() {
    return CanvasImageContext.state.images
  }

  afterCreated() {
    this.initLayer()
  }

  private initLayer() {
    const backgroundLayer = this.$shadow.querySelector<VCanvasBackgroundLayer>(
      'v-canvas-background-layer'
    )
    const imageLayer = this.$shadow.querySelector<VCanvasImageLayer>('v-canvas-image-layer')
    const drawingLayer = this.$shadow.querySelector<VCanvasDrawingLayer>('v-canvas-drawing-layer')

    if (!backgroundLayer || !imageLayer || !drawingLayer) {
      console.error('🚨 canvas container need drawing and image layer')
      return
    }

    this.backgroundLayer = backgroundLayer
    this.imageLayer = imageLayer
    this.drawingLayer = drawingLayer
  }

  bindEventListener() {
    this.drawingLayer.addEventListener('mousedown', this.propagateEventToImageLayer.bind(this))
    this.drawingLayer.addEventListener('mousemove', this.propagateEventToImageLayer.bind(this))
    this.drawingLayer.addEventListener('mouseup', this.propagateEventToImageLayer.bind(this))
    this.drawingLayer.addEventListener('touchstart', this.propagateEventToImageLayer.bind(this))
    this.drawingLayer.addEventListener('touchmove', this.propagateEventToImageLayer.bind(this))
    this.drawingLayer.addEventListener('touchend', this.propagateEventToImageLayer.bind(this))
  }

  propagateEventToImageLayer(ev: Event) {
    this.imageLayer.listenSiblingLayerEvent(ev)
  }

  protected subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.SAVE_ARCHIVE, this.onSaveArchive.bind(this))
    EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, this.onClearArchive.bind(this))
    EventBus.getInstance().on(EVENT_KEY.CREATE_NEW_ARCHIVE, this.onCreateNewArchive.bind(this))
    EventBus.getInstance().on(EVENT_KEY.DOWNLOAD, this.onDownload.bind(this))
  }

  private async onSaveArchive() {
    const images: Archive['images'] = this.images.map((image) => ({
      id: image.id,
      dataUrl: image.dataUrl,
      sx: image.sx,
      sy: image.sy,
      width: image.width,
      height: image.height,
      degree: image.degree,
    }))
    const imageSnapshot = images.length > 0 ? this.imageLayer.imageSnapshot : undefined
    const { title, memo } = ArchiveContext.state.archives.find(
      (archive) => archive.id === this.sid
    ) || { title: 'untitled', memo: '' }

    await addOrUpdateArchive({
      id: this.sid,
      title,
      memo,
      snapshot: lastOf(this.snapshots),
      imageSnapshot,
      images,
    })
    ArchiveContext.dispatch({ action: 'FETCH_ARCHIVES_FROM_IDB' })
  }

  private async onClearArchive() {
    clearCanvas(this.drawingLayer.canvas)
    this.imageLayer.resetFocusedImage()
    await Promise.all([
      CanvasDrawingContext.dispatch({ action: 'CLEAR_ALL' }),
      CanvasImageContext.dispatch({ action: 'CLEAR_IMAGE' }),
    ])
    EventBus.getInstance().emit(EVENT_KEY.SAVE_ARCHIVE)
  }

  private async onCreateNewArchive() {
    const id = getOneTimeSessionId()

    await addArchive({
      id,
      title: 'untitled',
      memo: '',
      snapshot: undefined,
      imageSnapshot: undefined,
      images: [],
    })
    await ArchiveContext.dispatch({ action: 'FETCH_ARCHIVES_FROM_IDB' })
    ArchiveContext.dispatch({ action: 'SET_SESSION_ID', data: id })
  }

  private onDownload() {
    const $origin = this.backgroundLayer.canvas
    const $canvas = document.createElement('canvas')
    $canvas.width = $origin.width
    $canvas.height = $origin.height

    const ctx = $canvas.getContext('2d')
    if (!ctx) {
      showToast('DOWNLOAD', 'FAIL')
      return
    }

    ctx.drawImage(this.backgroundLayer.canvas, 0, 0)
    ctx.drawImage(this.imageLayer.canvas, 0, 0)
    ctx.drawImage(this.drawingLayer.canvas, 0, 0)

    const $link = document.createElement('a')
    $link.download = 'image.png'
    $link.href = $canvas.toDataURL('image/png')
    $link.click()
    showToast('DOWNLOAD', 'SUCCESS')
  }
}
