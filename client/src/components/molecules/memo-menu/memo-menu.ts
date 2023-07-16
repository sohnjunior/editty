import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VTextInput from '@atoms/text-input/text-input'
import VTextarea from '@atoms/textarea/textarea'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host .input-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    :host .input-container > v-textarea {
      margin-top: 10px;
    }
  </style>
  <v-menu width="200px">
    <div slot="content">
      <div class="input-container">
        <v-text-input placeholder="제목"></v-text-input>
        <v-textarea  placeholder="메모" rows="8" cols="20"></v-textarea>
      </div>
      <v-button>저장</v-button>
    </div>
  </v-menu>
`

export default class VMemoMenu extends VComponent {
  static tag = 'v-memo-menu'
  private $textInput!: VTextInput
  private $textarea!: VTextarea

  constructor() {
    super(template)
  }

  afterCreated() {
    this.initInnerElement()
  }

  private initInnerElement() {
    const $textInput = this.$root.querySelector<VTextInput>('v-text-input')
    const $textarea = this.$root.querySelector<VTextarea>('v-textarea')
    if (!$textInput || !$textarea) {
      throw new Error('initialize fail')
    }

    this.$textInput = $textInput
    this.$textarea = $textarea
  }

  static get observedAttributes() {
    return ['open']
  }

  get open() {
    return this.getAttribute('open') === 'true'
  }
  set open(newValue: boolean) {
    this.setAttribute('open', `${newValue}`)
  }

  private _title!: string
  get title() {
    return this._title
  }
  set title(newValue: string) {
    this._title = newValue
    this.updateTitleProp(newValue)
  }

  private _memo!: string
  get memo() {
    return this._memo
  }
  set memo(newValue: string) {
    this._memo = newValue
    this.updateMemoProp(newValue)
  }

  protected bindEventListener() {
    this.$root.querySelector('v-button')?.addEventListener('click', this.handleSaveMemo.bind(this))
  }

  private async handleSaveMemo() {
    this.dispatchEvent(
      new CustomEvent('save:memo', {
        detail: { title: this.$textInput.value, memo: this.$textarea.value },
        bubbles: true,
        composed: true,
      })
    )
    this.dispatchEvent(new CustomEvent('close:menu'))
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam): void {
    switch (attribute) {
      case 'open':
        this.updateOpenProp(value === 'true')
        break
    }
  }

  private updateOpenProp(newValue: boolean) {
    this.$root.setAttribute('open', `${newValue}`)
  }

  private updateTitleProp(newValue: string) {
    this.$textInput.value = newValue
  }

  private updateMemoProp(newValue: string) {
    this.$textarea.value = newValue
  }
}
