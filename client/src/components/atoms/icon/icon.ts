import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const icon = [
  'cursor',
  'draw',
  'text',
  'back-arrow',
  'forward-arrow',
  'search',
  'erase',
  'emoji',
  'trash',
  'gallery',
  'folder',
  'disk',
] as const
const size = ['small', 'medium', 'large', 'xlarge'] as const

export type Icon = typeof icon[number]
export type Size = typeof size[number]

export const isIconType = (maybe: unknown): maybe is Icon => {
  return typeof maybe === 'string' && contains(icon, maybe)
}

export const isSizeType = (maybe: unknown): maybe is Size => {
  return typeof maybe === 'string' && contains(size, maybe)
}

function contains<T extends string>(list: ReadonlyArray<T>, value: string): value is T {
  return list.some((item) => item === value)
}

function generateIconUrl(type: Icon) {
  return `url('assets/images/${type}.svg')`
}

const SIZE: Record<Size, string> = {
  small: '10px',
  medium: '15px',
  large: '20px',
  xlarge: '25px',
}

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > div {
      display: block;
      background: transparent;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  </style>
  <div></div>
`

export default class VIcon extends VComponent {
  static tag = 'v-icon'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['icon', 'size']
  }

  get icon() {
    return this.getAttribute('icon') || ''
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

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'icon', value: this.icon })
    this.reflectAttribute({ attribute: 'size', value: this.size })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'icon':
        this.updateIconProp(value)
        break
      case 'size':
        this.updateSizeProp(value)
        break
    }
  }

  private updateIconProp(value: string) {
    if (!isIconType(value)) {
      return
    }

    this.$root.style.backgroundImage = generateIconUrl(value)
  }

  private updateSizeProp(value: string) {
    if (!isSizeType(value)) {
      return
    }

    this.$root.style.width = SIZE[value]
    this.$root.style.height = SIZE[value]
  }
}
