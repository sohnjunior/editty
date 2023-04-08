import { html } from 'lit-html'
import CanvasDrawingLayer from './canvas-drawing-layer'

customElements.define(CanvasDrawingLayer.tag, CanvasDrawingLayer)

export default {
  title: 'Elements / Canvas drawing layer',
}

export const Basic = () => html`<v-canvas-drawing-layer></v-canvas-drawing-layer>`
