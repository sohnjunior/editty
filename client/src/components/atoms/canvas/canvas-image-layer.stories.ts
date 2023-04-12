import { html } from 'lit-html'
import CanvasImageLayer from './canvas-image-layer'

customElements.define(CanvasImageLayer.tag, CanvasImageLayer)

export default {
  title: 'Elements / Canvas Image Layer',
}

export const Basic = () => html`<v-canvas-image-layer></v-canvas-image-layer>`
