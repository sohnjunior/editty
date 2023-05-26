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
    <v-toast
      variant="${variant}"
      open="${open}"
      autoclose="${autoclose}"
      title="${title}"
      description="${description}"
    >
    </v-toast>
  `
Basic.args = {
  variant: 'success',
  open: true,
  autoclose: true,
  title: 'Title',
  description: 'Description. Lorem ipsum dolor sit.',
}
