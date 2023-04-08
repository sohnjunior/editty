import { isIconType, isSizeType } from '@atoms/icon/icon'
import type { Icon as BaseIcon, Size as BaseSize } from '@atoms/icon/icon'

export type Icon = BaseIcon
export type Size = BaseSize

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      height: 19px;
    }

    :host > button {
      cursor: pointer;
      border: none;
      border-radius: 3px;
      background: transparent;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      padding: 2px;
    }

    :host > button:hover {
      background-color: rgba(151, 222, 255, 0.3);
    }

    :host > button:active {
      background-color: rgba(151, 222, 255, 0.2);
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

    // HACK: dom mount 이후 속성 가져오지 못하는 이슈 대응
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
