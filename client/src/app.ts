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

      <v-toast variant="success" open="false" autoclose="true">
        <span slot="title">성공</span>
        <span slot="description">저장에 성공했습니다.</span>
      </v-toast>
      <v-toast variant="fail" open="false" autoclose="true">
        <span slot="title">실패</span>
        <span slot="description">저장에 실패했습니다.</span>
      </v-toast>
    </main>
  </v-mobile-layout>
`

export default class App extends VComponent {
  static tag = 'v-app'

  private $saveSuccessToast!: VToast
  private $saveFailToast!: VToast

  constructor() {
    super(template)
  }

  protected afterCreated() {
    this.initToastElement()
  }

  private initToastElement() {
    const $successToast = this.$root.querySelector<VToast>('v-toast[variant="success"]')
    const $failToast = this.$root.querySelector<VToast>('v-toast[variant="fail"]')
    if (!$successToast || !$failToast) {
      throw new Error('initialize fail')
    }

    this.$saveSuccessToast = $successToast
    this.$saveFailToast = $failToast
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.SAVE_SUCCESS, this.onSaveSuccess.bind(this))
    EventBus.getInstance().on(EVENT_KEY.SAVE_FAIL, this.onSaveFail.bind(this))
  }

  private onSaveSuccess() {
    this.$saveSuccessToast.open = true
  }

  private onSaveFail() {
    this.$saveFailToast.open = true
  }
}
