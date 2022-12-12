const icon = ['delete', 'cursor', 'pen'] as const
const size = ['small', 'medium', 'large'] as const

export type Icon = typeof icon[number]
export type Size = typeof size[number]

export function contains<T extends string>(list: ReadonlyArray<T>, value: string): value is T {
  return list.some((item) => item === value)
}

const isIconType = (maybe: unknown): maybe is Icon => {
  return typeof maybe === 'string' && contains(icon, maybe)
}

const isSizeType = (maybe: unknown): maybe is Size => {
  return typeof maybe === 'string' && contains(size, maybe)
}

const URL: Record<Icon, string> = {
  delete: `url('assets/images/delete.svg')`,
  cursor: `url('assets/images/cursor.svg')`,
  pen: `url('assets/images/pen.svg')`,
}

const SIZE: Record<Size, string> = {
  small: '20px',
  medium: '30px',
  large: '40px',
}

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
  <button type="button"></button>
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

    initStyle()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    const $button = this.$root.querySelector('button')
    if (!$button) {
      return
    }

    switch (attribute) {
      case 'icon': {
        if (isIconType(value)) {
          $button.style.backgroundImage = URL[value]
          break
        }
      }
      case 'size': {
        if (isSizeType(value)) {
          $button.style.width = SIZE[value]
          $button.style.height = SIZE[value]
          break
        }
      }
    }
  }
}
