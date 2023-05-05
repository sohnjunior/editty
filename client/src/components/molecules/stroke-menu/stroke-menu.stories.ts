import { html } from 'lit-html'
import VStrokeMenu from './stroke-menu'
import type { Stroke } from './stroke-menu'

customElements.define(VStrokeMenu.tag, VStrokeMenu)

export default {
  title: 'Molecules / Stroke Menu',
}

interface Props {
  open: boolean
  stroke: Stroke
}

export const Basic = ({ open, stroke }: Props) =>
  html`<v-stroke-menu open="${open}" stroke="${stroke}"></v-stroke-menu>`
Basic.args = {
  open: true,
  stroke: 'draw',
}
