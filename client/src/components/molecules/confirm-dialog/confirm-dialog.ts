import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VDialog from '@atoms/dialog/dialog'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host v-button {
      flex-grow: 1;
    }
  </style>
  <v-dialog>
    <span slot="title">Confirm</span>
    <span slot="content"></span>
    <div slot="action">
      <v-button mode="outline" id="cancel-button">취소</v-button>
      <v-button mode="fill" id="confirm-button">확인</v-button>
    </div>
  </v-dialog>
`

export default class VConfirmDialog extends VComponent<VDialog> {
  static tag = 'v-confirm-dialog'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['open', 'content']
  }

  get open() {
    return this.getAttribute('open') === 'true' ? 'true' : 'false'
  }
  set open(newValue: 'true' | 'false') {
    this.setAttribute('open', newValue)
  }

  get content() {
    return this.getAttribute('content') || ''
  }
  set content(newValue: string) {
    this.setAttribute('content', newValue)
  }

  protected bindEventListener() {
    this.$root
      .querySelector('#confirm-button')
      ?.addEventListener('click', this.handleConfirm.bind(this))
    this.$root
      .querySelector('#cancel-button')
      ?.addEventListener('click', this.handleCancel.bind(this))
  }

  private handleConfirm(ev: Event) {
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('dialog:confirm', { bubbles: true, composed: true }))
    this.open = 'false'
  }

  private handleCancel(ev: Event) {
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('dialog:cancel', { bubbles: true, composed: true }))
    this.open = 'false'
  }

  protected bindInitialProp() {
    this.reflectAttribute({ attribute: 'open', value: this.open })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam): void {
    switch (attribute) {
      case 'open':
        this.updateOpenStyle(value)
        break
      case 'content':
        this.updateContent(value)
        break
    }
  }

  private updateOpenStyle(value: string) {
    if (value === 'true') {
      this.$root.open = 'true'
      this.$root.style.display = 'block'
    } else {
      this.$root.open = 'false'
      this.$root.style.display = 'none'
    }
  }

  private updateContent(value: string) {
    const $contentSlot = this.$root.querySelector('span[slot="content"]')
    if ($contentSlot) {
      $contentSlot.textContent = value
    }
  }
}
