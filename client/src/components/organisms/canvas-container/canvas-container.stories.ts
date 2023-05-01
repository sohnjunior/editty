import { html } from 'lit-html'
import CanvasBackgroundLayer from '@molecules/canvas-layer/background-layer'
import CanvasDrawingLayer from '@molecules/canvas-layer/drawing-layer'
import CanvasImageLayer from '@molecules/canvas-layer/image-layer'
import CanvasContainer from './canvas-container'

customElements.define(CanvasBackgroundLayer.tag, CanvasBackgroundLayer)
customElements.define(CanvasDrawingLayer.tag, CanvasDrawingLayer)
customElements.define(CanvasImageLayer.tag, CanvasImageLayer)
customElements.define(CanvasContainer.tag, CanvasContainer)

export default {
  title: 'Organisms / Canvas Container',
}

export const Basic = () =>
  html`
    <div style="width: 500px; height: 700px">
      <v-canvas-container></v-canvas-container>
    </div>
  `
