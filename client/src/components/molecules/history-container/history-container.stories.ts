import { html } from 'lit-html'

import HistoryContainer from './history-container'

customElements.define(HistoryContainer.tag, HistoryContainer)

export default {
  title: 'Molecules / History Container',
}

export const Basic = () => html`<v-history-container></v-history-container>`
