import { html } from 'lit-html'

import Container from '@elements/container'

customElements.define(Container.tag, Container)

export default {
  title: 'Elements / Container',
}

export const Basic = () => html`<v-container>자식</v-container>`
