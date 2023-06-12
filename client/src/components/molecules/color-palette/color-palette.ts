import { VComponent } from '@/modules/v-component'
import VColorTile from '@atoms/color-tile/color-tile'
import { PALETTE_COLORS } from '@/modules/canvas-engine/constant'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host .palette {
      max-height: 200px;
      min-height: 120px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

export default class VColorPalette extends VComponent {
  static tag = 'v-color-palette'

  constructor() {
    super(template)
  }

  bindEventListener() {
    this.$root.addEventListener('click', this.handleClickPalette.bind(this))
  }

  handleClickPalette(ev: Event) {
    const tagName = (ev.target as HTMLElement).tagName
    if (tagName !== 'V-COLOR-TILE') {
      return
    }

    const color = (ev.target as VColorTile).color
    this.dispatchEvent(
      new CustomEvent('select:color', {
        detail: { value: color },
        bubbles: true,
        composed: true,
      })
    )
  }
}
