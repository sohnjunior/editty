import { html } from 'lit-html'
import VTextInput from './text-input'

export default {
  title: 'Elements / Text Input',
}

interface BasicProps {
  value: string
  placeholder: string
  onChange: (e: CustomEvent) => void
}

export const Basic = ({ value, placeholder, onChange }: BasicProps) => {
  setTimeout(() => {
    const $textInput = document.querySelector<VTextInput>('v-text-input')
    if ($textInput) {
      $textInput.value = value
    }
  }, 0)

  return html` <v-text-input @change="${onChange}" placeholder="${placeholder}"> </v-text-input> `
}
Basic.args = {
  value: 'text',
  placeholder: 'input example',
  onChange: (e: CustomEvent) => console.log(e.detail.value),
}
