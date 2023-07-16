import { html } from 'lit-html'
import VTextarea from './textarea'

export default {
  title: 'Elements / Textarea',
}

interface Props {
  rows: number
  cols: number
  value: string
  placeholder: string
}

export const Basic = ({ value, placeholder, rows, cols }: Props) => {
  setTimeout(() => {
    const $textarea = document.querySelector<VTextarea>('v-textarea')
    if ($textarea) {
      $textarea.value = value
    }
  }, 0)

  return html`
    <v-textarea placeholder="${placeholder}" rows="${rows}" cols="${cols}"> </v-textarea>
  `
}
Basic.args = {
  value: '메모를 작성해주세요.',
  placeholder: '메모',
  rows: 10,
  cols: 20,
}
