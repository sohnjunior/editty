import { html } from 'lit-html'
import CanvasDrawingLayer from './canvas-drawing-layer'

customElements.define(CanvasDrawingLayer.tag, CanvasDrawingLayer)

export default {
  title: 'Molecules / Canvas Drawing Layer',
}

export const Basic = () => html`<v-canvas-drawing-layer></v-canvas-drawing-layer>`
