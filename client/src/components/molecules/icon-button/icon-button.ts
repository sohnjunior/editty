import { VComponent } from '@/modules/v-component'
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
      background-color: var(--color-primary30);
    }

    :host > button:active {
      background-color: var(--color-primary20);
    }
  </style>
  <button type="button">
    <v-icon />
  </button>
`

export default class VIconButton extends VComponent {
  static tag = 'v-icon-button'
  static get observedAttributes() {
    return ['icon', 'size']
  }

  get iconAttribute() {
    return this.getAttribute('icon') || 'trash'
  }

  get sizeAttribute() {
    return this.getAttribute('size') || 'small'
  }

  constructor() {
    super(template)
  }

  bindInitialStyle() {
    this.updateStyle({ attribute: 'icon', value: this.iconAttribute })
    this.updateStyle({ attribute: 'size', value: this.sizeAttribute })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    const $icon = this.$shadow.querySelector('v-icon')
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
