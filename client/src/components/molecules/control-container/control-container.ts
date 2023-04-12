import { EventBus, EVENT_KEY } from '@/event-bus'
import { CanvasContext } from '@/contexts'
import type { Phase } from '@/contexts'
import { selectImageFromDevice } from '@/utils/file'

const OPTIONS: Phase[] = ['cursor', 'draw', 'erase', 'emoji', 'gallery']
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    :host v-icon-button[data-selected="true"] {
      border-radius: 3px;
      background-color: rgba(151, 222, 255, 0.4);
    }
  </style>
  <v-container>
    ${OPTIONS.map(
      (control) =>
        `<v-icon-button data-selected="false" data-icon="${control}" icon="${control}" size="medium"></v-icon-button>`
    ).join('')}
  </v-container>
`

export default class VControlContainer extends HTMLElement {
  #$root!: ShadowRoot
  #$selectRef?: HTMLElement

  static tag = 'v-control-container'

  get phase() {
    return CanvasContext.state.phase
  }

  constructor() {
    const initShadowRoot = () => {
      this.#$root = this.attachShadow({ mode: 'open' })
      this.#$root.appendChild(template.content.cloneNode(true))
    }

    const initSelectedOption = () => {
      this.toggleOption('draw')
    }

    super()
    initShadowRoot()
    initSelectedOption()
  }

  connectedCallback() {
    const initEvents = () => {
      const $container = this.#$root.querySelector('v-container')

      $container?.addEventListener('click', async (e) => {
        const $target = e.target as HTMLElement

        switch ($target.dataset.icon) {
          case 'cursor':
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
            break
          case 'draw':
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
            break
          case 'erase':
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'erase' })
            break
          case 'gallery':
            this.uploadImage()
            CanvasContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
            break
          default:
            return
        }
      })
    }

    const subscribeContext = () => {
      CanvasContext.subscribe({
        action: 'SET_PHASE',
        effect: (context) => {
          this.toggleOption(context.state.phase)
        },
      })
    }

    initEvents()
    subscribeContext()
  }

  toggleOption(type: Phase) {
    const $target = this.#$root.querySelector(`v-icon-button[data-icon="${type}"]`) as HTMLElement

    if (this.#$selectRef) {
      this.#$selectRef.dataset.selected = 'false'
    }

    this.#$selectRef = $target
    this.#$selectRef.dataset.selected = 'true'
  }

  async uploadImage() {
    const dataUrls = await selectImageFromDevice()
    EventBus.getInstance().emit(EVENT_KEY.UPLOAD_IMAGE, dataUrls)
  }
}
