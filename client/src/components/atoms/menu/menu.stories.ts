import { html } from 'lit-html'
import VMenu from './menu'

customElements.define(VMenu.tag, VMenu)

export default {
  title: 'Elements / Menu',
}

interface Props {
  open: 'true' | 'false'
  width: string
}

export const Basic = ({ open, width }: Props) =>
  html`
    <v-menu open="${open}" width="${width}">
      <div slot="content">
        메뉴 항목을 slot으로 추가합니다. <br />
        open 속성으로 제어할 수 있습니다.
      </div>
    </v-menu>
  `
Basic.args = {
  open: 'true',
  width: '200px',
}
