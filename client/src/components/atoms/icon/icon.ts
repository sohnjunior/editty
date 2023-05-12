import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam } from '@/modules/v-component'

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

  static get observedAttributes() {
    return ['icon', 'size']
  }

  get iconAttribute() {
    return this.getAttribute('icon') || console.error('🚨 icon element need icon attributes')
  }

  get sizeAttribute() {
    return this.getAttribute('size') || console.error('🚨 icon element need size attributes')
  }

  constructor() {
    super(template)
  }

  bindInitialStyle() {
    const { iconAttribute, sizeAttribute } = this

    if (iconAttribute && sizeAttribute) {
      this.updateStyle({ attribute: 'icon', value: iconAttribute })
      this.updateStyle({ attribute: 'size', value: sizeAttribute })
    }
  }

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'icon': {
        if (isIconType(value)) {
          this.$root.style.backgroundImage = generateIconUrl(value)
        }
        break
      }
      case 'size': {
        if (isSizeType(value)) {
          this.$root.style.width = SIZE[value]
          this.$root.style.height = SIZE[value]
        }
        break
      }
    }
  }
}
