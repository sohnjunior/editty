import { html } from 'lit-html'

import ColorSelect from './color-palette'

customElements.define(ColorSelect.tag, ColorSelect)

export default {
  title: 'Molecules / Color Palette',
}

export const Basic = () => html`<v-color-palette></v-color-palette>`
