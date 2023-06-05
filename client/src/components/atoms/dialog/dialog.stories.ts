import { html } from 'lit-html'

export default {
  title: 'Elements / Dialog',
}

export const Basic = () => html`
  <v-dialog>
    <div slot="title">다이얼로그</div>
    <div slot="content">다이얼로그 내용</div>
    <div slot="action">
      <button>확인</button>
    </div>
  </v-dialog>
`
