import { isIconType, isSizeType } from './icon'
import type { Icon as BaseIcon, Size as BaseSize } from './icon'

export type Icon = BaseIcon
export type Size = BaseSize

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > button {
      cursor: pointer;
      border: none;
      background: transparent;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  </style>
  <button type="button">
    <v-icon />
  </button>
`

export default class VIconButton extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-icon-button'
  static get observedAttributes() {
    return ['icon', 'size']
  }

  get iconAttribute() {
    return this.getAttribute('icon') || 'delete'
  }

  get sizeAttribute() {
    return this.getAttribute('size') || 'small'
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }

  connectedCallback() {
    const initStyle = () => {
      this.updateStyle({ attribute: 'icon', value: this.iconAttribute })
      this.updateStyle({ attribute: 'size', value: this.sizeAttribute })
    }

    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    const $icon = this.$root.querySelector('v-icon')
    if (!$icon) {
      return
    }

    switch (attribute) {
      case 'icon': {
        if (isIconType(value)) {
          $icon.setAttribute('icon', value)
        }
        break
      }
      case 'size': {
        if (isSizeType(value)) {
          $icon.setAttribute('size', value)
        }
        break
      }
    }
  }
}
