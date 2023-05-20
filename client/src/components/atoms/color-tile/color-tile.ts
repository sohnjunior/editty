import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import { PALETTE_COLORS } from '@/utils/constant'

const template = document.createElement('template')
template.innerHTML = `
  <style>   
    :host > div {
      display: block;
      border-radius: 50%;
    }

    :host > div:hover {
      cursor: pointer;
    }
  </style>
  <div></div>
`

export default class VColorTile extends VComponent {
  static tag = 'v-color-tile'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['color', 'size']
  }

  get color() {
    const value = this.getAttribute('color')
    if (!value) {
      console.error('🚨 color-tile element require color attributes')
    }

    return this.getAttribute('color') || ''
  }
  set color(newValue: string) {
    this.setAttribute('color', newValue)
  }

  get size() {
    const value = this.getAttribute('size')
    if (!value) {
      console.error('🚨 color-tile element require size attributes')
    }
    return this.getAttribute('size') || ''
  }
  set size(newValue: string) {
    this.setAttribute('size', newValue)
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'color':
        this.updateColorStyle(value)
        break
      case 'size':
        this.updateSizeStyle(value)
        break
    }
  }

  private updateColorStyle(value: string) {
    this.$root.style.backgroundColor = PALETTE_COLORS[value]
  }

  private updateSizeStyle(value: string) {
    this.$root.style.width = value
    this.$root.style.height = value
  }
}
