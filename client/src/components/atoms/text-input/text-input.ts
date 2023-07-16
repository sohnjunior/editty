import { VComponent } from '@/modules/v-component'

import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > input[type="text"] {
      border: none;
      padding: 8px 10px;
      outline: none;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.12em;
      background-color: transparent;
    }
  </style>
  <input type="text" />
`

export default class VTextInput extends VComponent<HTMLInputElement> {
  static tag = 'v-text-input'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['placeholder']
  }

  get value() {
    return this.$root.value
  }
  set value(newValue: string) {
    this.$root.value = newValue
  }

  get placeholder() {
    return this.getAttribute('placeholder') || ''
  }
  set placeholder(newValue: string) {
    this.setAttribute('placeholder', newValue)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'placeholder', value: this.placeholder })
  }

  bindEventListener() {
    this.$root.addEventListener('input', this.handleInputChange.bind(this))
  }

  private handleInputChange(ev: Event) {
    const inputValue = (ev.target as HTMLInputElement).value
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: inputValue },
      })
    )
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'placeholder':
        this.updatePlaceholderProp(value)
        break
    }
  }

  private updatePlaceholderProp(value: string) {
    this.$root.placeholder = value
  }
}
