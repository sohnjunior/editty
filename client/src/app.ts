const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host .input-container {
      position: fixed;
      top: 20px;
      left: 20px;
    }

    :host .control-container {
      position: fixed;
      left: 20px;
      bottom: 40px;
    }

    :host .history-container {
      position: fixed;
      right: 20px;
      bottom: 40px;
    }
  </style>

  <v-mobile-layout>
    <main slot="main">
      <v-canvas></v-canvas>
      <v-input-container class="input-container"></v-input-container>
      <v-control-container class="control-container"></v-control-container>
      <v-history-container class="history-container"></v-history-container>
    </main>
  </v-mobile-layout>
`

export default class App extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-app'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
