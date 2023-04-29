import { Z_INDEX } from '@/utils/constant'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host v-input-container {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: ${Z_INDEX.ACTION_LAYER};
    }

    :host v-draw-toolbox {
      position: fixed;
      left: 20px;
      bottom: 40px;
      z-index: ${Z_INDEX.MENU_LAYER};
    }

    :host v-history-toolbox {
      position: fixed;
      right: 20px;
      bottom: 40px;
      z-index: ${Z_INDEX.ACTION_LAYER};
    }
  </style>

  <v-mobile-layout>
    <main slot="main">
      <v-canvas-container></v-canvas-container>
      <v-input-container></v-input-container>
      <v-draw-toolbox></v-draw-toolbox>
      <v-history-toolbox></v-history-toolbox>
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
