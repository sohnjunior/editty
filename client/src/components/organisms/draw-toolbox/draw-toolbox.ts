import { VComponent } from '@/modules/v-component'
import { CanvasDrawingContext } from '@/contexts'
import type { Phase } from '@/contexts'
import { selectImageFromDevice } from '@/utils/file'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { PALETTE_COLORS } from '@/utils/constant'

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

    :host v-color-tile {
      margin: 1px;
      border: 1px solid var(--color-gray);
      border-radius: 50%;
      box-sizing: border-box;
    }

    :host v-color-tile[data-selected="true"] {
      border: 1px solid var(--color-primary40);
    }

    :host v-color-menu {
      position: absolute;
      left: 80px;
      bottom: 0;
    }
  </style>
  <v-container>
    <v-icon-button data-selected="false" data-phase="cursor" icon="cursor" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="draw" icon="draw" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="erase" icon="erase" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="emoji" icon="emoji" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="gallery" icon="gallery" size="medium"></v-icon-button>
    <v-color-tile data-selected="false" data-phase="color" color="java" size="15px"></v-color-tile>

    <v-color-menu open="false"></v-color-menu>
  </v-container>
`

export default class VDrawToolbox extends VComponent {
  static tag = 'v-draw-toolbox'
  private $selectRef?: HTMLElement
  private $colorMenu!: HTMLElement
  private $colorTile!: HTMLElement

  get phase() {
    return CanvasDrawingContext.state.phase
  }

  get pencilColor() {
    return PALETTE_COLORS[CanvasDrawingContext.state.pencilColor]
  }

  constructor() {
    super(template)
  }

  afterCreated(): void {
    const initInnerElement = () => {
      const $colorMenu = this.$shadow.querySelector('v-color-menu')
      const $colorTile = this.$shadow.querySelector('v-color-tile')
      if (!$colorMenu || !$colorTile) {
        throw new Error('initialize fail')
      }

      this.$colorMenu = $colorMenu as HTMLElement
      this.$colorTile = $colorTile as HTMLElement
    }
    const initSelectedOption = () => {
      this.toggleOption('draw')
    }

    initInnerElement()
    initSelectedOption()
  }

  bindInitialStyle() {
    this.setPencilColor(this.pencilColor)
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
    CanvasDrawingContext.subscribe({
      action: 'SET_PENCIL_COLOR',
      effect: (context) => {
        this.setPencilColor(context.state.pencilColor)
      },
    })
  }

  handleClickOption(ev: Event) {
    const phase = (ev.target as HTMLElement).dataset.phase
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
      case 'color':
        this.enterColorPhase()
        break
      default:
        break
    }
  }

  enterCursorPhase() {
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  enterDrawPhase() {
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
  }

  enterErasePhase() {
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'erase' })
  }

  enterGalleryPhase() {
    this.uploadImage()
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  enterColorPhase() {
    this.handleOpenDrawOptionMenu()
  }

  setPencilColor(color: string) {
    this.$colorTile.setAttribute('color', color)
  }

  handleChangePencilColor(ev: Event) {
    const color = (ev as CustomEvent).detail.value
    CanvasDrawingContext.dispatch({ action: 'SET_PENCIL_COLOR', data: color })
  }

  handleOpenDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'true')
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'color' })
  }

  handleCloseDrawOptionMenu() {
    this.$colorMenu.setAttribute('open', 'false')
    CanvasDrawingContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
  }

  toggleOption(type: Phase) {
    if (this.$selectRef) {
      this.$selectRef.dataset.selected = 'false'
    }

    const $selected = this.$shadow.querySelector(`[data-phase="${type}"]`) as HTMLElement
    this.$selectRef = $selected
    this.$selectRef.dataset.selected = 'true'
  }

  async uploadImage() {
    const dataUrls = await selectImageFromDevice()
    EventBus.getInstance().emit(EVENT_KEY.UPLOAD_IMAGE, dataUrls)
  }
}
