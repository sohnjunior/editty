import { html } from 'lit-html'

export default {
  title: 'Elements / Button',
}

interface Props {
  mode: 'fill' | 'outline'
  variant: 'primary'
  children: string
  onClick: () => void
}

export const Basic = ({ mode, variant, children, onClick }: Props) =>
  html`<v-button mode="${mode}" variant="${variant}" @click="${onClick}">${children}</v-button>`
Basic.args = {
  mode: 'fill',
  variant: 'primary',
  children: '예시 버튼',
  onClick: () => console.log('clicked!'),
}
