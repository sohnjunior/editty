import { VComponent } from '@/modules/v-component'
import { Z_INDEX, NOOP } from '@/utils/constant'
import { EventBus, EVENT_KEY } from '@/event-bus'
import VToast from '@atoms/toast/toast'
import VConfirmDialog from '@molecules/confirm-dialog/confirm-dialog'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host v-canvas-toolbox {
      position: fixed;
      left: 20px;
      bottom: 20px;
      z-index: ${Z_INDEX.MENU_LAYER};
    }

    :host v-history-toolbox {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: ${Z_INDEX.ACTION_LAYER};
    }

    :host v-memo-toolbox {
      position: fixed;
      left: 20px;
      top: 20px;
      z-index: ${Z_INDEX.ACTION_LAYER};
    }

    :host v-toast {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: ${Z_INDEX.TOAST_LAYER};
    }
  </style>

  <v-mobile-layout>
    <main slot="main">
      <v-canvas-container></v-canvas-container>
      <v-canvas-toolbox></v-canvas-toolbox>
      <v-history-toolbox></v-history-toolbox>
      <v-memo-toolbox></v-memo-toolbox>
      <v-toast variant="success" open="false" autoclose="true" title="" description=""></v-toast>
      <v-confirm-dialog open="false" content=""></v-confirm-dialog>
    </main>
  </v-mobile-layout>
`

export default class App extends VComponent {
  static tag = 'v-app'

  constructor() {
    super(template)
  }

  private $toast!: VToast
  private $dialog!: VConfirmDialog

  protected afterCreated() {
    this.initToastElement()
  }

  private initToastElement() {
    const $toast = this.$root.querySelector<VToast>('v-toast')
    const $dialog = this.$root.querySelector<VConfirmDialog>('v-confirm-dialog')
    if (!$toast || !$dialog) {
      throw new Error('initialize fail')
    }

    this.$toast = $toast
    this.$dialog = $dialog
  }

  protected bindEventListener() {
    this.$dialog.addEventListener('dialog:confirm', this.handleClearConfirm)
    this.$dialog.addEventListener('dialog:cancel', NOOP)
  }

  private handleClearConfirm() {
    EventBus.getInstance().emit(EVENT_KEY.CLEAR_ALL)
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.SHOW_TOAST, this.onShowToast.bind(this))
    EventBus.getInstance().on(EVENT_KEY.SHOW_CONFIRM, this.onShowConfirmDialog.bind(this))
  }

  private onShowToast(variant: string, title: string, description: string) {
    this.updateToastVariant(variant)
    this.updateToastContent(title, description)
    this.$toast.open = true
  }

  private updateToastVariant(variant: string) {
    this.$toast.variant = variant
  }

  private updateToastContent(title: string, description: string) {
    this.$toast.title = title
    this.$toast.description = description
  }

  private onShowConfirmDialog(content: string) {
    this.$dialog.content = content
    this.$dialog.open = 'true'
  }
}
