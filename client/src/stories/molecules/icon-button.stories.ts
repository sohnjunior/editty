import { html } from 'lit-html'

import IconButton from '@/components/molecules/icon-button'
import type { Icon, Size } from '@/components/molecules/icon-button'

customElements.define(IconButton.tag, IconButton)

export default {
  title: 'Elements / Icon Button',
  argTypes: {
    icon: { control: 'select', options: ['delete', 'cursor', 'pen'] },
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
  icon: 'delete',
  size: 'medium',
}
