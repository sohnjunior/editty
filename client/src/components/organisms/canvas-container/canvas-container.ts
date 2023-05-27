import { VComponent } from '@/modules/v-component'
import VCanvasImageLayer from '@molecules/canvas-layer/image-layer'
import VCanvasDrawingLayer from '@molecules/canvas-layer/drawing-layer'
import { getOneTimeSessionId } from '@/services/session'
import { addArchive, addOrUpdateArchive } from '@/services/archive'
import type { Archive } from '@/services/archive'
import { lastOf } from '@/utils/ramda'
import {
  CanvasMetaContext,
  CanvasDrawingContext,
  CanvasImageContext,
  ArchiveContext,
} from '@/contexts'
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
  private imageLayer!: VCanvasImageLayer
  private drawingLayer!: VCanvasDrawingLayer

  constructor() {
    super(template)
  }

  get sid() {
    return ArchiveContext.state.sid!
  }

  get title() {
    return CanvasMetaContext.state.title
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
    const imageLayer = this.$shadow.querySelector<VCanvasImageLayer>('v-canvas-image-layer')
    const drawingLayer = this.$shadow.querySelector<VCanvasDrawingLayer>('v-canvas-drawing-layer')

    if (!imageLayer || !drawingLayer) {
      console.error('🚨 canvas container need drawing and image layer')
      return
    }

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
    EventBus.getInstance().on(EVENT_KEY.CREATE_NEW_ARCHIVE, this.onCreateNewArchive.bind(this))
  }

  private async onSaveArchive() {
    const images: Archive['images'] = this.images.map((image) => ({
      dataUrl: image.dataUrl,
      sx: image.sx,
      sy: image.sy,
      width: image.width,
      height: image.height,
    }))
    await addOrUpdateArchive({
      id: this.sid,
      title: this.title,
      snapshot: lastOf(this.snapshots),
      images,
    })
    ArchiveContext.dispatch({ action: 'FETCH_ARCHIVES_FROM_IDB' })
  }

  private async onCreateNewArchive() {
    const id = getOneTimeSessionId()

    await addArchive({
      id,
      title: this.title,
      snapshot: undefined,
      images: [],
    })

    await ArchiveContext.dispatch({ action: 'SET_SESSION_ID', data: id })
    ArchiveContext.dispatch({ action: 'FETCH_ARCHIVES_FROM_IDB' })
  }
}
