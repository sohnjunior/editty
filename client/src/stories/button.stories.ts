import { html } from 'lit-html'

import Button from '@atoms/button'

customElements.define(Button.displayName, Button)

export default {
  title: 'Atoms / Button',
}

export const Basic = ({ color, onClick }: { color: string; onClick: () => void }) =>
  html`<atom-button color="${color}" @click="${onClick}"></atom-button>`
Basic.args = {
  color: 'blue',
  onClick: () => console.log('clicked!'),
}
