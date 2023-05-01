import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam } from '@/modules/v-component'

import { Z_INDEX } from '@/utils/constant'
import { fillBackgroundColor, refineCanvasRatioForRetinaDisplay } from '@/modules/canvas.utils'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host #background-layer {
      width: 100%;
      height: 100%;
      z-index: ${Z_INDEX.CANVAS_LAYER.BACKGROUND};
      position: absolute;
    }
  </style>
  <canvas id="background-layer"></canvas>
`

export default class VCanvasBackgroundLayer extends VComponent<HTMLCanvasElement> {
  static tag = 'v-canvas-background-layer'

  static get observedAttributes() {
    return ['color']
  }

  get colorAttribute() {
    return this.getAttribute('color') || '#f8f8f8'
  }

  constructor() {
    super(template)
    refineCanvasRatioForRetinaDisplay(this.$root)
  }

  bindInitialStyle() {
    const { colorAttribute } = this

    if (colorAttribute) {
      fillBackgroundColor(this.$root, colorAttribute)
    }
  }

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'color': {
        fillBackgroundColor(this.$root, value)
        break
      }
    }
  }
}
