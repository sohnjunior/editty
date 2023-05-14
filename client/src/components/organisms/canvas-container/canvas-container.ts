import { VComponent } from '@/modules/v-component'
import VCanvasImageLayer from '@molecules/canvas-layer/image-layer'
import VCanvasDrawingLayer from '@molecules/canvas-layer/drawing-layer'

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
}
