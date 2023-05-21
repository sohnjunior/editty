import { html } from 'lit-html'

export default {
  title: 'Elements / Toast',
}

interface Props {
  variant: 'success' | 'fail'
  open: boolean
  autoclose: boolean
  title: string
  description: string
}

export const Basic = ({ variant, open, autoclose, title, description }: Props) =>
  html`
    <v-toast variant="${variant}" open="${open}" autoclose="${autoclose}">
      <span slot="title">${title}</span>
      <span slot="description">${description}</span>
    </v-toast>
  `
Basic.args = {
  variant: 'success',
  open: true,
  autoclose: true,
  title: 'Title',
  description: 'Description. Lorem ipsum dolor sit.',
}
