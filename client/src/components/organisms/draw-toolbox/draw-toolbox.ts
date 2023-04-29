import { CanvasContext } from '@/contexts'
import type { Phase } from '@/contexts'
import { selectImageFromDevice } from '@/utils/file'
import { EventBus, EVENT_KEY } from '@/event-bus'

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
      background-color: var(--color-primary40);
    }

    :host v-color-menu {
      position: absolute;
      left: 80px;
      bottom: 0;
    }
  </style>
  <v-container>
    ${OPTIONS.map(
      (control) =>
        `<v-icon-button data-selected="false" data-icon="${control}" icon="${control}" size="medium"></v-icon-button>`
    ).join('')}

    <v-color-menu open="false"></v-color-menu>
  </v-container>
`

export default class VDrawToolbox extends HTMLElement {
  private $root!: ShadowRoot
  private $container!: HTMLElement
  private $selectRef?: HTMLElement
  private $colorMenu!: HTMLElement

  static tag = 'v-draw-toolbox'

  get phase() {
    return CanvasContext.state.phase
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }
    const initInnerElement = () => {
      const $container = this.$root.querySelector('v-container')
      const $colorMenu = this.$root.querySelector('v-color-menu')
      if (!$container || !$colorMenu) {
        throw new Error('initialize fail')
      }

      this.$container = $container as HTMLElement
      this.$colorMenu = $colorMenu as HTMLElement
    }
    const initSelectedOption = () => {
      this.toggleOption('draw')
    }

    super()
    initShadowRoot()
    initInnerElement()
    initSelectedOption()
  }

  connectedCallback() {
    const initEvents = () => {
      this.$container.addEventListener('click', this.handleClickOption.bind(this))
      this.$colorMenu.addEventListener('select:color', this.handleChangePencilColor.bind(this))
      this.$colorMenu.addEventListener('close:menu', this.handleCloseDrawOptionMenu.bind(this))
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

  handleClickOption(ev: Event) {
    const phase = (ev.target as HTMLElement).dataset.icon
    switch (phase) {
      case 'cursor':
        this.enterCursorPhase()
        break
      case 'draw':
        this.enterDrawPhase()
        break
      case 'erase':
        this.enterErasePhase()
        break
      case 'gallery':
        this.enterGalleryPhase()
        break
      default:
        break
    }
  }

  enterCursorPhase() {
    CanvasContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  enterDrawPhase() {
    this.handleOpenDrawOptionMenu()
    CanvasContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
  }

  enterErasePhase() {
    CanvasContext.dispatch({ action: 'SET_PHASE', data: 'erase' })
  }

  enterGalleryPhase() {
    this.uploadImage()
    CanvasContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  handleChangePencilColor(ev: Event) {
    const color = (ev as CustomEvent).detail.value
    CanvasContext.dispatch({ action: 'SET_PENCIL_COLOR', data: color })
  }

  handleOpenDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'true')
  }

  handleCloseDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'false')
  }

  toggleOption(type: Phase) {
    const $target = this.$root.querySelector(`v-icon-button[data-icon="${type}"]`) as HTMLElement

    if (this.$selectRef) {
      this.$selectRef.dataset.selected = 'false'
    }

    this.$selectRef = $target
    this.$selectRef.dataset.selected = 'true'
  }

  async uploadImage() {
    const dataUrls = await selectImageFromDevice()
    EventBus.getInstance().emit(EVENT_KEY.UPLOAD_IMAGE, dataUrls)
  }
}
