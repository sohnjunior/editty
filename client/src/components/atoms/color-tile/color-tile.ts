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
    super(template)
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
        this.$root.style.backgroundColor = PALETTE_COLORS[value]
        break
      case 'size':
        this.$root.style.width = value
        this.$root.style.height = value
        break
    }
  }
}
