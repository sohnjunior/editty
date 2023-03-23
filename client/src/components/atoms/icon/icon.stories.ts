import { html } from 'lit-html'

import VIcon from './icon'
import type { Icon, Size } from './icon'

customElements.define(VIcon.tag, VIcon)

export default {
  title: 'Elements / Icon',
}

interface Props {
  icon: Icon
  size: Size
}

export const Basic = ({ icon, size }: Props) => html`<v-icon icon="${icon}" size="${size}" />`
Basic.args = {
  icon: 'delete',
  size: 'small',
}
