import { html } from 'lit-html'
import type { Icon, Size } from './icon'

export default {
  title: 'Elements / Icon',
}

interface Props {
  icon: Icon
  size: Size
}

export const Basic = ({ icon, size }: Props) => html`<v-icon icon="${icon}" size="${size}" />`
Basic.args = {
  icon: 'trash',
  size: 'small',
}
