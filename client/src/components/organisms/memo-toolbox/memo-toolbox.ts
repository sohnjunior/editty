import { VComponent } from '@/modules/v-component'
import { ArchiveContext } from '@/contexts'
import VMemoMenu from '@molecules/memo-menu/memo-menu'
import type { Archive } from '@/services/archive'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host v-memo-menu {
      position: absolute;
      left: 0px;
      top: 60px;
    }
  </style>
  <v-container>
    <v-icon-button data-icon="document" icon="document" size="medium"></v-icon-button> 

    <v-memo-menu open="false"></v-memo-menu>
  </v-container>
`

export default class VMemoToolbox extends VComponent {
  static tag = 'v-memo-toolbox'
  private $memoMenu!: VMemoMenu

  constructor() {
    super(template)
  }

  afterCreated() {
    this.initInnerElement()
  }

  private initInnerElement() {
    const $memoMenu = this.$shadow.querySelector<VMemoMenu>('v-memo-menu')
    if (!$memoMenu) {
      throw new Error('initialize fail')
    }

    this.$memoMenu = $memoMenu
  }

  bindEventListener() {
    this.$root.addEventListener('click', this.handleOpenMenu.bind(this))
    this.$memoMenu.addEventListener('close:menu', this.handleCloseMenu.bind(this))
  }

  handleOpenMenu() {
    this.$memoMenu.open = true
  }

  handleCloseMenu() {
    this.$memoMenu.open = false
  }

  protected subscribeContext() {
    ArchiveContext.subscribe({
      action: 'SET_SESSION_ID',
      effect: (context) => {
        const { sid, archives } = context.state
        const currentArchive = archives.find((archive) => archive.id === sid)
        if (currentArchive) {
          this.setMemo(currentArchive)
        }
      },
    })
    ArchiveContext.subscribe({
      action: 'FETCH_ARCHIVES_FROM_IDB',
      effect: (context) => {
        const { sid, archives } = context.state
        const currentArchive = archives.find((archive) => archive.id === sid)
        if (currentArchive) {
          this.setMemo(currentArchive)
        }
      },
    })
  }

  private setMemo(archive: Archive) {
    this.$memoMenu.title = archive.title
    this.$memoMenu.memo = archive.memo
  }
}
