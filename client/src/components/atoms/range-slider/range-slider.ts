import { VComponent } from '@/modules/v-component'
// import type { UpdatePropertyParam } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host input[type="range"] {
      -webkit-appearance: none;
      display: block;
      position: relative;
      border-radius: 10px;
      background: #C0DBFB;
      cursor: ew-resize;
      width: 100%;
      height: 8px;
      margin: 0;
    }

    :host input[type="range"]::-webkit-slider-thumb,
    :host input[type="range"]::-moz-slider-thumb,
    :host input[type="range"]::-ms-slider-thumb {
      -webkit-appearance: none;
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: var(--color-primary);
      cursor: ew-resize;
      box-shadow: 0 0 2px 0 #777;
      transition: background .3s ease-in-out;
    }
  </style>
  <input type="range">
`

export default class VRangeSlider extends VComponent<HTMLInputElement> {
  static tag = 'v-range-slider'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['min', 'max', 'value']
  }

  get min() {
    return this.getAttribute('min') || '0'
  }
  set min(newValue: string) {
    this.setAttribute('min', newValue)
  }

  get max() {
    return this.getAttribute('max') || '0'
  }
  set max(newValue: string) {
    this.setAttribute('max', newValue)
  }

  get value() {
    return this.$root.value
  }
  set value(value: string) {
    this.$root.value = value
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'min', value: this.min })
    this.reflectAttribute({ attribute: 'max', value: this.max })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'min':
      case 'max':
        this.updateMinMaxProp(attribute, value)
        break
      case 'value':
        this.updateValueProp(value)
        break
    }
  }

  private updateMinMaxProp(attribute: 'min' | 'max', value: string) {
    this.$root.setAttribute(attribute, value)
  }

  private updateValueProp(value: string) {
    this.$root.setAttribute('value', value)
  }
}
