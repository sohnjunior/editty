import { CanvasContext } from '@/contexts'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon-button data-icon="cursor" icon="cursor" size="medium"></v-icon-button>
    <v-icon-button data-icon="pen" icon="pen" size="medium"></v-icon-button>
    <v-icon-button data-icon="eraser" icon="eraser" size="medium"></v-icon-button>
    <v-icon-button data-icon="emoji" icon="emoji" size="medium"></v-icon-button>
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

  connectedCallback() {
    const initEvents = () => {
      const $container = this.$root.querySelector('v-container')

      $container?.addEventListener('click', (e) => {
        const $target = e.target as HTMLElement

        switch ($target.dataset.icon) {
          case 'pen':
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'drawing' })
            break
          case 'eraser':
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'erasing' })
            break
          default:
            return
        }
      })
    }

    initEvents()
  }
}
