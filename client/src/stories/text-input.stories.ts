import { html } from 'lit-html'

import TextInput from '@elements/text-input'

customElements.define(TextInput.tag, TextInput)

export default {
  title: 'Elements / Text Input',
}

export const Basic = () => html`<v-text-input></v-text-input>`
