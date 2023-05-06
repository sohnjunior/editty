import { html } from 'lit-html'
import type { Stroke } from './stroke-menu'

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
