import { html } from 'lit-html'
import CanvasContainer from './canvas-container'

customElements.define(CanvasContainer.tag, CanvasContainer)

export default {
  title: 'Organisms / Canvas Container',
}

export const Basic = () =>
  html`<div style="width: 500px; height: 700px"><v-canvas-container></v-canvas-container></div>`
