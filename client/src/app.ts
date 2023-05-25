import { VComponent } from '@/modules/v-component'
import { Z_INDEX } from '@/utils/constant'
import { EventBus, EVENT_KEY } from '@/event-bus'
import VToast from '@atoms/toast/toast'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host v-canvas-toolbox {
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

      <v-toast variant="success" open="false" autoclose="true" title="" description=""></v-toast>
    </main>
  </v-mobile-layout>
`

export default class App extends VComponent {
  static tag = 'v-app'

  constructor() {
    super(template)
  }

  private $toast!: VToast

  protected afterCreated() {
    this.initToastElement()
  }

  private initToastElement() {
    const $toast = this.$root.querySelector<VToast>('v-toast')
    if (!$toast) {
      throw new Error('initialize fail')
    }

    this.$toast = $toast
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.SHOW_TOAST, this.onShowToast.bind(this))
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
}
