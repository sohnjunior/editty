import { html } from 'lit-html'

export default {
  title: 'Molecules / Confirm Dialog',
}

interface Props {
  content: string
}

export const Basic = ({ content }: Props) =>
  html` <v-confirm-dialog content="${content}"> </v-confirm-dialog> `
Basic.args = {
  content: '알림 내용',
}
