import { html } from 'lit-html'

import HistoryToolbox from './history-toolbox'

customElements.define(HistoryToolbox.tag, HistoryToolbox)

export default {
  title: 'Organisms / History Toolbox',
}

export const Basic = () => html`<v-history-toolbox></v-history-toolbox>`
