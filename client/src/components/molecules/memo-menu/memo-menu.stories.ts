import { html } from 'lit-html'

export default {
  title: 'Molecules / Memo Menu',
}

interface Props {
  open: boolean
}

export const Basic = ({ open }: Props) => html`<v-memo-menu open="${open}"></v-memo-menu>`
Basic.args = {
  open: true,
}
