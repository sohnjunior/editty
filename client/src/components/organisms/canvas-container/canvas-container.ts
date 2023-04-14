import VCanvasImageLayer from '@/components/molecules/canvas/canvas-image-layer'
import VCanvasDrawingLayer from '@/components/molecules/canvas/canvas-drawing-layer'

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

export default class VCanvasContainer extends HTMLElement {
  private $root!: ShadowRoot
  private imageLayer!: VCanvasImageLayer
  private drawingLayer!: VCanvasDrawingLayer

  static tag = 'v-canvas-container'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initLayer = () => {
      const imageLayer = this.$root.querySelector('v-canvas-image-layer') as VCanvasImageLayer
      const drawingLayer = this.$root.querySelector('v-canvas-drawing-layer') as VCanvasDrawingLayer

      if (!imageLayer || !drawingLayer) {
        console.error('🚨 canvas container need drawing and image layer')
        return
      }

      this.imageLayer = imageLayer
      this.drawingLayer = drawingLayer
    }

    super()
    initShadowRoot()
    initLayer()
  }

  connectedCallback() {
    const propagateEvents = () => {
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

    propagateEvents()
  }
}
