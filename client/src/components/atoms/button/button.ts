import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: block;
  }
  </style>
  <button>
    <slot></slot>
  </button>
`

export default class VButton extends VComponent {
  static tag = 'v-button'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['color']
  }

  get color() {
    return this.getAttribute('color') || 'red'
  }
  set color(newValue: string) {
    this.setAttribute('color', newValue)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'color', value: this.color })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'color':
        this.updateColorStyle(value)
        break
    }
  }

  private updateColorStyle(value: string) {
    this.$root.style.color = value
  }
}
