import { html } from 'lit-html'

import Container from '@atoms/container'

customElements.define(Container.tag, Container)

export default {
  title: 'Atoms / Container',
}

export const Basic = () => html`<v-container>자식</v-container>`
