import { html } from 'lit-html'

import Button from '@atoms/button'

customElements.define(Button.tag, Button)

export default {
  title: 'Atoms / Button',
}

export const Basic = ({ color, onClick }: { color: string; onClick: () => void }) =>
  html`<v-button color="${color}" @click="${onClick}"></v-button>`
Basic.args = {
  color: 'blue',
  onClick: () => console.log('clicked!'),
}
