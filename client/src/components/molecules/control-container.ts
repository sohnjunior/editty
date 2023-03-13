const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon-button icon="cursor" size="medium"></v-icon-button>
    <v-icon-button icon="pen" size="medium"></v-icon-button>
    <v-icon-button icon="text" size="medium"></v-icon-button>
  </v-container>
`

export default class VControlContainer extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-control-container'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
