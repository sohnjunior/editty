import { html } from 'lit-html'
import CanvasBackgroundLayer from './background-layer'

customElements.define(CanvasBackgroundLayer.tag, CanvasBackgroundLayer)

export default {
  title: 'Molecules / Canvas Background Layer',
}

interface Props {
  color: string
}

export const Basic = ({ color }: Props) =>
  html` <v-canvas-background-layer color="${color}"></v-canvas-background-layer> `
Basic.args = {
  color: 'blue',
}