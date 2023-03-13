const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      align-items: center;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon icon="search" size="medium"></v-icon>
    <v-text-input placeholder="search images" />
  </v-container>
`

export default class VInputContainer extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-input-container'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
