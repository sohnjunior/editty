import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > textarea {
      padding: 14px;
      border: none;
      border-radius: 6px;
      background-color: var(-color-white);
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.12em;
      color: var(--color-davy-gray);
      resize: none;
    }

    :host > textarea:focus {
      outline: none;
    }
  </style>
  <textarea></textarea>
`

export default class VTextarea extends VComponent<HTMLTextAreaElement> {
  static tag = 'v-textarea'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['rows', 'cols', 'placeholder']
  }

  get value() {
    return this.$root.value
  }
  set value(newValue: string) {
    this.$root.value = newValue
  }

  get rows() {
    return this.getAttribute('rows') || '5'
  }
  set rows(newValue: string) {
    this.setAttribute('rows', newValue)
  }

  get cols() {
    return this.getAttribute('cols') || '15'
  }
  set cols(newValue: string) {
    this.setAttribute('cols', newValue)
  }

  get placeholder() {
    return this.getAttribute('placeholder') || ''
  }
  set placeholder(newValue: string) {
    this.setAttribute('placeholder', newValue)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'rows', value: this.rows })
    this.reflectAttribute({ attribute: 'cols', value: this.cols })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'rows':
        this.updateRowsProp(value)
        break
      case 'cols':
        this.updateColsProp(value)
        break
      case 'placeholder':
        this.updatePlaceholderProp(value)
        break
    }
  }

  private updateRowsProp(value: string) {
    this.$root.rows = Number(value)
  }

  private updateColsProp(value: string) {
    this.$root.cols = Number(value)
  }

  private updatePlaceholderProp(value: string) {
    this.$root.placeholder = value
  }
}
