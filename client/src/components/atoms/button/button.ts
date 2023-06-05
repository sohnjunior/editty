import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: block;
  }

  :host button {
    width: 100%;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    padding: 13px 16px;
    font-size: 14px;
    line-height: 14px;
  }

  :host button[data-variant="primary"][data-mode="fill"] {
    color: var(--color-white);
    background-color: var(--color-azure);
  }

  :host button[data-variant="primary"][data-mode="outline"] {
    color: var(--color-azure);
    background-color: var(--color-azure15);
  }

  </style>
  <button data-mode="outline" data-variant="primary">
    <slot></slot>
  </button>
`

export default class VButton extends VComponent {
  static tag = 'v-button'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['mode', 'variant']
  }

  get mode() {
    return this.getAttribute('mode') || 'fill'
  }
  set mode(newValue: string) {
    this.setAttribute('mode', newValue)
  }

  get variant() {
    return this.getAttribute('variant') || 'primary'
  }
  set variant(newValue: string) {
    this.setAttribute('variant', newValue)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'mode', value: this.mode })
    this.reflectAttribute({ attribute: 'variant', value: this.variant })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'mode':
        this.updateMode(value)
        break
      case 'variant':
        this.updateVariant(value)
        break
    }
  }

  private updateMode(value: string) {
    this.$root.dataset.mode = value
  }

  private updateVariant(value: string) {
    this.$root.dataset.variant = value
  }
}
