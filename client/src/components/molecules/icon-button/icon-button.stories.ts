import { html } from 'lit-html'

import IconButton from './icon-button'
import type { Icon, Size } from './icon-button'

customElements.define(IconButton.tag, IconButton)

export default {
  title: 'Elements / Icon Button',
  argTypes: {
    icon: { control: 'select', options: ['trash', 'cursor', 'pen'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
}

interface BasicProps {
  icon: Icon
  size: Size
}

export const Basic = ({ icon, size }: BasicProps) =>
  html`<v-icon-button icon="${icon}" size="${size}"></v-icon-button>`
Basic.args = {
  icon: 'trash',
  size: 'medium',
}
