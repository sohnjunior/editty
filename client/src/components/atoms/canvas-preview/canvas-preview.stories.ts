import { html } from 'lit-html'

export default {
  title: 'Elements / Canvas Preview',
}

interface Props {
  caption: string
  selected: boolean
}

export const Basic = ({ caption, selected }: Props) =>
  html`<v-canvas-preview caption="${caption}" selected="${selected}"></v-canvas-preview>`
Basic.args = {
  caption: '프리뷰 설명',
  selected: true,
}
