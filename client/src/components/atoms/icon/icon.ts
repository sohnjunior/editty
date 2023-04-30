import { VComponent } from '@/modules/v-component'

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
] as const
const size = ['small', 'medium', 'large', 'xlarge'] as const

export type Icon = typeof icon[number]
export type Size = typeof size[number]

function contains<T extends string>(list: ReadonlyArray<T>, value: string): value is T {
  return list.some((item) => item === value)
}

export const isIconType = (maybe: unknown): maybe is Icon => {
  return typeof maybe === 'string' && contains(icon, maybe)
}

export const isSizeType = (maybe: unknown): maybe is Size => {
  return typeof maybe === 'string' && contains(size, maybe)
}

const ASSET_URL: Record<Icon, string> = {
  cursor: `url('assets/images/cursor.svg')`,
  draw: `url('assets/images/pen.svg')`,
  text: `url('assets/images/text.svg')`,
  'back-arrow': `url('assets/images/back-arrow.svg')`,
  'forward-arrow': `url('assets/images/forward-arrow.svg')`,
  search: `url('assets/images/search.svg')`,
  erase: `url('assets/images/eraser.svg')`,
  emoji: `url('assets/images/emoji.svg')`,
  trash: `url('assets/images/trash.svg')`,
  gallery: `url('assets/images/gallery.svg')`,
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

  connectedCallback() {
    const initStyle = () => {
      const { iconAttribute, sizeAttribute } = this

      if (iconAttribute && sizeAttribute) {
        this.updateStyle({ attribute: 'icon', value: iconAttribute })
        this.updateStyle({ attribute: 'size', value: sizeAttribute })
      }
    }

    // HACK: dom mount 이후 속성 가져오지 못하는 이슈 대응
    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    const $icon = this.$root.querySelector('div')

    if (!$icon) {
      return
    }

    switch (attribute) {
      case 'icon': {
        if (isIconType(value)) {
          $icon.style.backgroundImage = ASSET_URL[value]
        }
        break
      }
      case 'size': {
        if (isSizeType(value)) {
          $icon.style.width = SIZE[value]
          $icon.style.height = SIZE[value]
        }
        break
      }
    }
  }
}
