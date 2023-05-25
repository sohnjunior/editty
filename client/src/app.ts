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

      <v-toast data-type="save-success" variant="success" open="false" autoclose="true">
        <span slot="title">성공</span>
        <span slot="description">저장에 성공했습니다.</span>
      </v-toast>
      <v-toast data-type="save-fail" variant="fail" open="false" autoclose="true">
        <span slot="title">실패</span>
        <span slot="description">저장에 실패했습니다.</span>
      </v-toast>
      <v-toast data-type="add-success" variant="success" open="false" autoclose="true">
        <span slot="title">성공</span>
        <span slot="description">캔버스 생성에 성공했습니다.</span>
      </v-toast>
      <v-toast data-type="add-fail" variant="fail" open="false" autoclose="true">
        <span slot="title">실패</span>
        <span slot="description">캔버스 생성에 실패했습니다.</span>
      </v-toast>
      <v-toast data-type="delete-success" variant="success" open="false" autoclose="true">
        <span slot="title">성공</span>
        <span slot="description">삭제되었습니다.</span>
      </v-toast>
      <v-toast data-type="delete-fail" variant="fail" open="false" autoclose="true">
        <span slot="title">실패</span>
        <span slot="description">삭제에 실패했습니다.</span>
      </v-toast>
    </main>
  </v-mobile-layout>
`

export default class App extends VComponent {
  static tag = 'v-app'

  private $saveSuccessToast!: VToast
  private $saveFailToast!: VToast
  private $addSuccessToast!: VToast
  private $addFailToast!: VToast
  private $deleteSuccessToast!: VToast
  private $deleteFailToast!: VToast

  constructor() {
    super(template)
  }

  protected afterCreated() {
    this.initToastElement()
  }

  private initToastElement() {
    const $saveSuccessToast = this.$root.querySelector<VToast>('v-toast[data-type="save-success"]')
    const $saveFailToast = this.$root.querySelector<VToast>('v-toast[data-type="save-fail"]')
    const $addSuccessToast = this.$root.querySelector<VToast>('v-toast[data-type="add-success"]')
    const $addFailToast = this.$root.querySelector<VToast>('v-toast[data-type="add-fail"]')
    const $deleteSuccessToast = this.$root.querySelector<VToast>(
      'v-toast[data-type="delete-success"]'
    )
    const $deleteFailToast = this.$root.querySelector<VToast>('v-toast[data-type="delete-fail"]')

    if (
      !$saveSuccessToast ||
      !$saveFailToast ||
      !$addSuccessToast ||
      !$addFailToast ||
      !$deleteSuccessToast ||
      !$deleteFailToast
    ) {
      throw new Error('initialize fail')
    }

    this.$saveSuccessToast = $saveSuccessToast
    this.$saveFailToast = $saveFailToast
    this.$addSuccessToast = $addSuccessToast
    this.$addFailToast = $addFailToast
    this.$deleteSuccessToast = $deleteSuccessToast
    this.$deleteFailToast = $deleteFailToast
  }

  subscribeEventBus() {
    EventBus.getInstance().on(EVENT_KEY.SAVE_SUCCESS, this.onSaveSuccess.bind(this))
    EventBus.getInstance().on(EVENT_KEY.SAVE_FAIL, this.onSaveFail.bind(this))
    EventBus.getInstance().on(EVENT_KEY.ADD_SUCCESS, this.onAddSuccess.bind(this))
    EventBus.getInstance().on(EVENT_KEY.ADD_FAIL, this.onAddFail.bind(this))
    EventBus.getInstance().on(EVENT_KEY.DELETE_SUCCESS, this.onDeleteSuccess.bind(this))
    EventBus.getInstance().on(EVENT_KEY.DELETE_FAIL, this.onDeleteFail.bind(this))
  }

  private onSaveSuccess() {
    this.$saveSuccessToast.open = true
  }

  private onSaveFail() {
    this.$saveFailToast.open = true
  }

  private onAddSuccess() {
    this.$addSuccessToast.open = true
  }

  private onAddFail() {
    this.$addFailToast.open = true
  }

  private onDeleteSuccess() {
    this.$deleteSuccessToast.open = true
  }

  private onDeleteFail() {
    this.$deleteFailToast.open = true
  }
}
