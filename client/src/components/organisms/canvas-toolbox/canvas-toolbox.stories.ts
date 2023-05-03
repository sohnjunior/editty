import { html } from 'lit-html'

import VDrawToolbox from './canvas-toolbox'

customElements.define(VDrawToolbox.tag, VDrawToolbox)

export default {
  title: 'Organisms / Canvas Toolbox',
}

export const Basic = () =>
  html`
    <div style="padding: 100px;">
      <v-canvas-toolbox></v-canvas-toolbox>
    </div>
  `
