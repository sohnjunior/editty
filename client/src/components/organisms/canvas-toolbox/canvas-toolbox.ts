import { VComponent } from '@/modules/v-component'
import { CanvasDrawingContext, CanvasMetaContext, ArchiveContext } from '@/contexts'
import type { Phase } from '@/contexts'
import { selectImageFromDevice } from '@/utils/file'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { PALETTE_COLORS } from '@/modules/canvas-utils/constant'
import VColorMenu from '@molecules/color-menu/color-menu'
import VStrokeMenu from '@molecules/stroke-menu/stroke-menu'
import VArchiveMenu from '@molecules/archive-menu/archive-menu'
import type { Archive } from '@/services/archive'
import { getOneTimeSessionId } from '@/services/session'

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

    :host v-color-menu, v-stroke-menu, v-archive-menu {
      position: absolute;
      left: 80px;
      bottom: 0;
    }
  </style>
  <v-container>
    <v-icon-button data-selected="false" data-phase="cursor" icon="cursor" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="stroke" icon="draw" size="medium"></v-icon-button>
    <v-color-tile data-selected="false" data-phase="color" color="none" size="15px"></v-color-tile>
    <v-icon-button data-selected="false" data-phase="gallery" icon="gallery" size="medium"></v-icon-button>
    <v-icon-button data-selected="false" data-phase="folder" icon="folder" size="medium"></v-icon-button>

    <v-stroke-menu open="false"></v-stroke-menu>
    <v-color-menu open="false"></v-color-menu>
    <v-archive-menu open="false"></v-archive-menu>
  </v-container>
`

export default class VCanvasToolbox extends VComponent {
  static tag = 'v-canvas-toolbox'
  private $selectRef?: HTMLElement
  private $colorMenu!: VColorMenu
  private $colorPreview!: HTMLElement
  private $strokeMenu!: VStrokeMenu
  private $archiveMenu!: VArchiveMenu

  get sid() {
    return ArchiveContext.state.sid
  }

  get phase() {
    return CanvasMetaContext.state.phase
  }

  get pencilColor() {
    return PALETTE_COLORS[CanvasDrawingContext.state.pencilColor]
  }

  constructor() {
    super(template)
  }

  afterCreated(): void {
    this.initInnerElement()
    this.initArchives()
    this.toggleCanvasPhase('draw')
    this.setPencilColorPreview(CanvasDrawingContext.state.pencilColor)
  }

  private initInnerElement() {
    const $colorMenu = this.$shadow.querySelector<VColorMenu>('v-color-menu')
    const $colorTile = this.$shadow.querySelector<HTMLElement>('v-color-tile')
    const $strokeMenu = this.$shadow.querySelector<VStrokeMenu>('v-stroke-menu')
    const $archiveMenu = this.$shadow.querySelector<VArchiveMenu>('v-archive-menu')
    if (!$colorMenu || !$colorTile || !$strokeMenu || !$archiveMenu) {
      throw new Error('initialize fail')
    }

    this.$colorMenu = $colorMenu
    this.$colorPreview = $colorTile
    this.$strokeMenu = $strokeMenu
    this.$archiveMenu = $archiveMenu
  }

  private async initArchives() {
    ArchiveContext.dispatch({ action: 'FETCH_ARCHIVES_FROM_IDB' })
    this.$archiveMenu.value = this.sid ?? ''
  }

  bindEventListener() {
    this.$root.addEventListener('click', this.handleClickOption.bind(this))
    this.$colorMenu.addEventListener('select:color', this.handleChangePencilColor.bind(this))
    this.$colorMenu.addEventListener('close:menu', this.handleCloseColorMenu.bind(this))
    this.$strokeMenu.addEventListener('stroke:select', this.handleSelectStroke.bind(this))
    this.$strokeMenu.addEventListener('stroke:resize', this.handleResizeStroke.bind(this))
    this.$strokeMenu.addEventListener('close:menu', this.handleCloseStrokeMenu.bind(this))
    this.$archiveMenu.addEventListener('add:archive', this.handleAddArchive.bind(this))
    this.$archiveMenu.addEventListener('delete:archive', this.handleDeleteArchive.bind(this))
    this.$archiveMenu.addEventListener('select:archive', this.handleSelectArchive.bind(this))
    this.$archiveMenu.addEventListener('close:menu', this.handleCloseArchiveMenu.bind(this))
  }

  subscribeContext() {
    ArchiveContext.subscribe({
      action: 'FETCH_ARCHIVES_FROM_IDB',
      effect: (context) => {
        this.updateArchivePreviews(context.state.archives)
      },
    })
    ArchiveContext.subscribe({
      action: 'DELETE_ARCHIVE',
      effect: (context) => {
        this.updateArchivePreviews(context.state.archives)

        // 💡 if all archives were deleted, generate new session id
        const nextId = context.state.archives[0]?.id ?? getOneTimeSessionId()
        this.$archiveMenu.value = nextId
        ArchiveContext.dispatch({ action: 'SET_SESSION_ID', data: nextId })
      },
    })
    CanvasMetaContext.subscribe({
      action: 'SET_PHASE',
      effect: (context) => {
        this.toggleCanvasPhase(context.state.phase)
      },
    })
    CanvasDrawingContext.subscribe({
      action: 'SET_PENCIL_COLOR',
      effect: (context) => {
        this.setPencilColorPreview(context.state.pencilColor)
      },
    })
  }

  private updateArchivePreviews(archives: Archive[]) {
    const archivePreviews = archives.map((archive) => ({
      id: archive.id,
      title: archive.title,
    }))
    this.$archiveMenu.archives = archivePreviews
  }

  handleClickOption(ev: Event) {
    const phase = (ev.target as HTMLElement).dataset.phase
    switch (phase) {
      case 'cursor':
        this.enterCursorPhase()
        break
      case 'stroke':
        this.enterStrokePhase()
        break
      case 'gallery':
        this.enterGalleryPhase()
        break
      case 'color':
        this.enterColorPhase()
        break
      case 'folder':
        this.enterFolderPhase()
        break
      default:
        break
    }
  }

  enterCursorPhase() {
    CanvasMetaContext.dispatch({ action: 'SET_PHASE', data: 'cursor' })
  }

  enterStrokePhase() {
    this.handleOpenStrokeMenu()
  }

  enterGalleryPhase() {
    this.uploadImage()
    this.enterCursorPhase()
  }

  enterColorPhase() {
    this.handleOpenColorMenu()
  }

  enterFolderPhase() {
    this.handleOpenArchiveMenu()
  }

  handleChangePencilColor(ev: Event) {
    const color = (ev as CustomEvent).detail.value
    CanvasDrawingContext.dispatch({ action: 'SET_PENCIL_COLOR', data: color })
  }

  handleOpenColorMenu() {
    this.$colorMenu.open = true
    CanvasMetaContext.dispatch({ action: 'SET_PHASE', data: 'color' })
  }

  handleCloseColorMenu() {
    this.$colorMenu.open = false
    CanvasMetaContext.dispatch({ action: 'SET_PHASE', data: 'draw' })
  }

  handleOpenStrokeMenu() {
    this.$strokeMenu.open = true
  }

  handleCloseStrokeMenu() {
    this.$strokeMenu.open = false
  }

  handleOpenArchiveMenu() {
    this.$archiveMenu.open = true
  }

  handleCloseArchiveMenu() {
    this.$archiveMenu.open = false
  }

  handleAddArchive() {
    EventBus.getInstance().emit(EVENT_KEY.CREATE_NEW_ARCHIVE)
  }

  handleDeleteArchive(ev: Event) {
    const sid = (ev as CustomEvent).detail.value
    ArchiveContext.dispatch({ action: 'DELETE_ARCHIVE', data: sid })
  }

  handleSelectArchive(ev: Event) {
    const sid = (ev as CustomEvent).detail.value
    this.$archiveMenu.value = sid
    ArchiveContext.dispatch({ action: 'SET_SESSION_ID', data: sid })
  }

  handleSelectStroke(ev: Event) {
    const stroke = (ev as CustomEvent).detail.value
    CanvasMetaContext.dispatch({ action: 'SET_PHASE', data: stroke })
  }

  handleResizeStroke(ev: Event) {
    const size = (ev as CustomEvent).detail.value
    CanvasDrawingContext.dispatch({ action: 'SET_STROKE_SIZE', data: size })
  }

  private setPencilColorPreview(color: string) {
    this.$colorPreview.setAttribute('color', color)
  }

  private toggleCanvasPhase(type: Phase) {
    if (this.$selectRef) {
      this.$selectRef.dataset.selected = 'false'
    }

    const optionMap = {
      cursor: 'cursor',
      draw: 'stroke',
      erase: 'stroke',
      emoji: 'emoji',
      gallery: 'gallery',
      color: 'color',
    }

    const $selected = this.$shadow.querySelector<HTMLElement>(`[data-phase="${optionMap[type]}"]`)
    if (!$selected) {
      return
    }

    $selected.dataset.selected = 'true'
    this.$selectRef = $selected

    if (type === 'draw' || type === 'erase') {
      this.$strokeMenu.stroke = type
      $selected.setAttribute('icon', type)
    }
  }

  private async uploadImage() {
    const dataUrls = await selectImageFromDevice()
    EventBus.getInstance().emit(EVENT_KEY.UPLOAD_IMAGE, dataUrls)
  }
}
