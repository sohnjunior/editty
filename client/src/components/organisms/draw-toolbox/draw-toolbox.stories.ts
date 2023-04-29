import { html } from 'lit-html'

import VDrawToolbox from './draw-toolbox'

customElements.define(VDrawToolbox.tag, VDrawToolbox)

export default {
  title: 'Organisms / Draw Toolbox',
}

export const Basic = () =>
  html`<div style="padding: 100px;"><v-draw-toolbox></v-draw-toolbox></div>`
