import { html } from 'lit-html'

import VColorTile from './color-tile'

customElements.define(VColorTile.tag, VColorTile)

export default {
  title: 'Elements / Color Tile',
}

interface Props {
  color: string
  size: string
}

export const Basic = ({ color, size }: Props) =>
  html`<v-color-tile color="${color}" size="${size}"></v-color-tile>`
Basic.args = {
  color: 'anakiwa',
  size: '20px',
}
