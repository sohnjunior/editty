import { html } from 'lit-html'

import VColorMenu from './color-menu'

customElements.define(VColorMenu.tag, VColorMenu)

export default {
  title: 'Molecules / Color Menu',
}

export const Basic = () => html`<v-color-menu></v-color-menu>`
