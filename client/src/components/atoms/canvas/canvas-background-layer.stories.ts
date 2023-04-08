import { html } from 'lit-html'
import CanvasBackgroundLayer from './canvas-background-layer'

customElements.define(CanvasBackgroundLayer.tag, CanvasBackgroundLayer)

export default {
  title: 'Elements / Canvas background layer',
}

interface Props {
  color: string
}

export const Basic = ({ color }: Props) =>
  html` <v-canvas-background-layer color="${color}"></v-canvas-background-layer> `
Basic.args = {
  color: 'blue',
}
