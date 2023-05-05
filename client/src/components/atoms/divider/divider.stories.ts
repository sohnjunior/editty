import { html } from 'lit-html'
import VDivider from './divider'

customElements.define(VDivider.tag, VDivider)

export default {
  title: 'Elements / Divider',
}

interface Props {
  size: string
  spacing: string
}

export const Basic = ({ size, spacing }: Props) =>
  html` <v-divider size="${size}" spacing="${spacing}"></v-divider> `
Basic.args = {
  size: '10px',
  spacing: '5px',
}
