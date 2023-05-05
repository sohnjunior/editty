import { html } from 'lit-html'

import VColorMenu from './color-menu'

customElements.define(VColorMenu.tag, VColorMenu)

export default {
  title: 'Molecules / Color Menu',
}

interface Props {
  open: boolean
}

export const Basic = ({ open }: Props) => html`<v-color-menu open="${open}"></v-color-menu>`
Basic.args = {
  open: true,
}
