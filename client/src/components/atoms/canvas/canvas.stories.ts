import { html } from 'lit-html'
import Canvas from './canvas'

customElements.define(Canvas.tag, Canvas)

export default {
  title: 'Elements / Canvas',
}

export const Basic = () =>
  html`
    <div style="width: 500px; height: 400px;">
      <v-canvas></v-canvas>
    </div>
  `
