import { html } from 'lit-html'

import ControlContainer from '@molecules/control-container'

customElements.define(ControlContainer.tag, ControlContainer)

export default {
  title: 'Molecules / Control Container',
}

export const Basic = () => html`<v-control-container></v-control-container>`
