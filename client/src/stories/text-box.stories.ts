import { html } from 'lit-html'

import TextBox from '../components/text-box'

customElements.define(TextBox.displayName, TextBox)

export default {
  title: 'Text Box',
}

export const Basic = () => html`<text-box></text-box>`
