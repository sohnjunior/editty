import { html } from 'lit-html'

import InputContainer from '@/components/molecules/input-container/input-container'

customElements.define(InputContainer.tag, InputContainer)

export default {
  title: 'Molecules / Input Container',
}

export const Basic = () => html`<v-input-container></v-input-container>`
