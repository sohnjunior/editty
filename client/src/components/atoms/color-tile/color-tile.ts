import { VComponent } from '@/modules/v-component'
import { PALETTE_COLORS } from '@/utils/constant'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > div {
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
  public $div!: HTMLDivElement

  static get observedAttributes() {
    return ['color', 'size']
  }

  get colorAttribute() {
    return (
      this.getAttribute('color') || console.error('🚨 color tile element need color attributes')
    )
  }

  get sizeAttribute() {
    return this.getAttribute('size') || '10px'
  }

  constructor() {
    const initInnerElement = () => {
      const $div = this.$shadow.querySelector('div')
      if (!$div) {
        throw new Error('initialize fail')
      }

      this.$div = $div as HTMLDivElement
    }

    super(template)
    initInnerElement()
  }

  connectedCallback() {
    const initStyle = () => {
      const { colorAttribute, sizeAttribute } = this

      if (colorAttribute) {
        this.updateStyle({ attribute: 'color', value: colorAttribute })
      }

      if (sizeAttribute) {
        this.updateStyle({ attribute: 'size', value: sizeAttribute })
      }
    }

    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    switch (attribute) {
      case 'color':
        this.$div.style.backgroundColor = PALETTE_COLORS[value]
        break
      case 'size':
        this.$div.style.width = value
        this.$div.style.height = value
        break
    }
  }
}
