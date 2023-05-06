import { html } from 'lit-html'

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
