import { VComponent } from '@/modules/v-component'
import { CanvasDrawingContext } from '@/contexts'
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

export default class VDrawToolbox extends VComponent {
  static tag = 'v-draw-toolbox'
  private $selectRef?: HTMLElement
  private $colorMenu!: HTMLElement

  get phase() {
    return CanvasDrawingContext.state.phase
  }

  constructor() {
    const initInnerElement = () => {
      const $colorMenu = this.$shadow.querySelector('v-color-menu')
      if (!$colorMenu) {
        throw new Error('initialize fail')
      }

      this.$colorMenu = $colorMenu as HTMLElement
    }
    const initSelectedOption = () => {
      this.toggleOption('draw')
    }

    super(template)
    initInnerElement()
    initSelectedOption()
  }

  bindEventListener() {
    this.$root.addEventListener('click', this.handleClickOption.bind(this))
    this.$colorMenu.addEventListener('select:color', this.handleChangePencilColor.bind(this))
    this.$colorMenu.addEventListener('close:menu', this.handleCloseDrawOptionMenu.bind(this))
  }

  subscribeContext() {
    CanvasDrawingContext.subscribe({
      action: 'SET_PHASE',
      effect: (context) => {
        this.toggleOption(context.state.phase)
      },
    })
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
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  enterDrawPhase() {
    this.handleOpenDrawOptionMenu()
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
  }

  enterErasePhase() {
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'erase' })
  }

  enterGalleryPhase() {
    this.uploadImage()
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  handleChangePencilColor(ev: Event) {
    const color = (ev as CustomEvent).detail.value
    CanvasDrawingContext.dispatch({ action: 'SET_PENCIL_COLOR', data: color })
  }

  handleOpenDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'true')
  }

  handleCloseDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'false')
  }

  toggleOption(type: Phase) {
    const $target = this.$shadow.querySelector(`v-icon-button[data-icon="${type}"]`) as HTMLElement

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
