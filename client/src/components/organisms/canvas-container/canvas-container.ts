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
    const initLayer = () => {
      const imageLayer = this.$shadow.querySelector('v-canvas-image-layer') as VCanvasImageLayer
      const drawingLayer = this.$shadow.querySelector(
        'v-canvas-drawing-layer'
      ) as VCanvasDrawingLayer

      if (!imageLayer || !drawingLayer) {
        console.error('🚨 canvas container need drawing and image layer')
        return
      }

      this.imageLayer = imageLayer
      this.drawingLayer = drawingLayer
    }

    super(template)
    initLayer()
  }

  afterMount() {
    const propagateEventToImageLayer = (ev: Event) => {
      this.imageLayer.listenSiblingLayerEvent(ev)
    }

    this.drawingLayer.addEventListener('mousedown', propagateEventToImageLayer)
    this.drawingLayer.addEventListener('mousemove', propagateEventToImageLayer)
    this.drawingLayer.addEventListener('mouseup', propagateEventToImageLayer)
    this.drawingLayer.addEventListener('touchstart', propagateEventToImageLayer)
    this.drawingLayer.addEventListener('touchmove', propagateEventToImageLayer)
    this.drawingLayer.addEventListener('touchend', propagateEventToImageLayer)
  }
}
