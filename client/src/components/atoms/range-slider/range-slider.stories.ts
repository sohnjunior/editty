import { html } from 'lit-html'

export default {
  title: 'Elements / Range Slider',
}

interface Props {
  min: string
  max: string
  value: string
}

export const Basic = ({ min, max, value }: Props) =>
  html`<v-range-slider min="${min}" max="${max}" value="${value}"></v-range-slider>`
Basic.args = {
  min: '0',
  max: '100',
  value: '50',
}
