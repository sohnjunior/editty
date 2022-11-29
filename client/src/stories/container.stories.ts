import { html } from 'lit-html'

import Container from '@atoms/container'

customElements.define(Container.displayName, Container)

export default {
  title: 'Atoms / Container',
}

export const Basic = () => html`<atom-container>자식</atom-container>`
