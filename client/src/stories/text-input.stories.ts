import { html } from 'lit-html'

import TextInput from '@elements/text-input'

customElements.define(TextInput.tag, TextInput)

export default {
  title: 'Elements / Text Input',
}

interface BasicProps {
  placeholder: string
  onChange: (e: CustomEvent) => void
}

export const Basic = ({ placeholder, onChange }: BasicProps) =>
  html`<v-text-input @change="${onChange}" placeholder="${placeholder}"></v-text-input>`
Basic.args = {
  placeholder: 'input example',
  onChange: (e: CustomEvent) => console.log(e.detail.value),
}
