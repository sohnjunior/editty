import { VComponent } from '@/modules/v-component'
import type { UpdatePropertyParam } from '@/modules/v-component'

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
  <input type="range" min="0" max="50">
`

export default class VRangeSlider extends VComponent<HTMLInputElement> {
  static tag = 'v-range-slider'
  static get observedAttributes() {
    return ['min', 'max', 'value']
  }

  get minAttribute() {
    return this.getAttribute('min') || '0'
  }

  get maxAttribute() {
    return this.getAttribute('max') || '100'
  }

  get value() {
    return this.$root.value
  }

  set value(value: string) {
    this.$root.value = value
  }

  constructor() {
    super(template)
  }

  afterMount() {
    this.updateProperty({ attribute: 'max', value: this.maxAttribute })
    this.updateProperty({ attribute: 'min', value: this.minAttribute })
  }

  updateProperty({ attribute, value }: UpdatePropertyParam) {
    switch (attribute) {
      case 'min':
      case 'max':
        this.$root.setAttribute(attribute, value)
        break
      case 'value':
        this.$root.setAttribute(attribute, value)
        break
    }
  }
}
