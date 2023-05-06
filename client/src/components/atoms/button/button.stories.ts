import { html } from 'lit-html'

export default {
  title: 'Elements / Button',
}

interface Props {
  color: string
  children: string
  onClick: () => void
}

export const Basic = ({ color, children, onClick }: Props) =>
  html`<v-button color="${color}" @click="${onClick}">${children}</v-button>`
Basic.args = {
  color: 'blue',
  children: '예시 버튼',
  onClick: () => console.log('clicked!'),
}
