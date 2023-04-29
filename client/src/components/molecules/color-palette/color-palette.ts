import VColorTile from '@atoms/color-tile/color-tile'
import { PALETTE_COLORS } from '@/utils/constant'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host .palette {
      max-height: 200px;
      min-height: 120px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: 25px;
      overflow: scroll;
    }
  </style>

  <div class="palette">
    ${Object.keys(PALETTE_COLORS)
      .map((color) => `<v-color-tile color="${color}" size="30px"></v-color-tile>`)
      .join('')}
  </div>
`

export default class VColorPalette extends HTMLElement {
  static tag = 'v-color-palette'

  private $root!: ShadowRoot
  private $div!: HTMLElement

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initInnerElement = () => {
      const $div = this.$root.querySelector('div.palette')
      if (!$div) {
        throw new Error('initialize fail')
      }

      this.$div = $div as HTMLElement
    }

    super()
    initShadowRoot()
    initInnerElement()
  }

  connectedCallback() {
    const initEvents = () => {
      this.$div.addEventListener('click', (ev) => {
        const tagName = (ev.target as HTMLElement).tagName
        if (tagName === 'V-COLOR-TILE') {
          const color = (ev.target as VColorTile).colorAttribute

          this.dispatchEvent(
            new CustomEvent('select:color', {
              detail: { value: color },
              bubbles: true,
            })
          )
        }
      })
    }

    initEvents()
  }
}
