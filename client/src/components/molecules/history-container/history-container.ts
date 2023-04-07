import { CanvasContext } from '@/contexts/canvas-context/context'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon-button data-icon="back" icon="back-arrow" size="medium"></v-icon-button>
    <v-icon-button data-icon="forward" icon="forward-arrow" size="medium"></v-icon-button>
    <v-icon-button data-icon="trash" icon="trash" size="medium"></v-icon-button>
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

  connectedCallback() {
    const initEvents = () => {
      const $container = this.$root.querySelector('v-container')

      $container?.addEventListener('click', (e) => {
        const $target = e.target as HTMLElement

        switch ($target.dataset.icon) {
          case 'back':
            CanvasContext.dispatch({ action: 'POP_SNAPSHOT' })
            break
          case 'forward':
            break
          case 'trash':
            break
          default:
            return
        }
      })
    }

    initEvents()
  }
}
