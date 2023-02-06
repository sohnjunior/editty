import { html } from 'lit-html'

import Button from '@elements/button'

customElements.define(Button.tag, Button)

export default {
  title: 'Elements / Button',
}

export const Basic = ({ color, onClick }: { color: string; onClick: () => void }) =>
  html`<v-button color="${color}" @click="${onClick}"></v-button>`
Basic.args = {
  color: 'blue',
  onClick: () => console.log('clicked!'),
}
