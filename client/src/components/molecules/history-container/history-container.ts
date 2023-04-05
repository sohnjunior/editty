const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon-button icon="back-arrow" size="medium"></v-icon-button>
    <v-icon-button icon="forward-arrow" size="medium"></v-icon-button>
    <v-icon-button icon="trash" size="medium"></v-icon-button>
  </v-container>
`

export default class VHistoryContainer extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-history-container'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
