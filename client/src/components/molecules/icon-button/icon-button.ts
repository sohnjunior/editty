import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VIcon from '@atoms/icon/icon'
import { isIconType, isSizeType } from '@atoms/icon/icon'
import type { Icon as BaseIcon, Size as BaseSize } from '@atoms/icon/icon'

export type Icon = BaseIcon
export type Size = BaseSize

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > button {
      display: block;
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

  private $icon!: VIcon

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['icon', 'size']
  }

  get icon() {
    return this.getAttribute('icon') || 'cursor'
  }
  set icon(newValue: string) {
    this.setAttribute('icon', newValue)
  }

  get size() {
    return this.getAttribute('size') || 'small'
  }
  set size(newValue: string) {
    this.setAttribute('size', newValue)
  }

  afterMount() {
    this.initInnerIconElement()
    this.reflectAttribute({ attribute: 'icon', value: this.icon })
    this.reflectAttribute({ attribute: 'size', value: this.size })
  }

  private initInnerIconElement() {
    const $icon = this.$root.querySelector<VIcon>('v-icon')
    if (!$icon) {
      throw new Error('initialize fail')
    }

    this.$icon = $icon
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'icon': {
        this.updateIcon(value)
        break
      }
      case 'size': {
        this.updateSize(value)
        break
      }
    }
  }

  private updateIcon(value: string) {
    if (!this.$icon || !isIconType(value)) {
      return
    }

    this.$icon.icon = value
  }

  private updateSize(value: string) {
    if (!this.$icon || !isSizeType(value)) {
      return
    }

    this.$icon.size = value
  }
}
