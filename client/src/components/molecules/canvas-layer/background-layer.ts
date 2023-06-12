import { VComponent } from '@/modules/v-component'

import { Z_INDEX } from '@/utils/constant'
import {
  fillBackgroundColor,
  refineCanvasRatioForRetinaDisplay,
} from '@/modules/canvas-engine/graphic'
import { ReflectAttributeParam } from '@/modules/v-component/types'

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

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['color']
  }

  get color() {
    return this.getAttribute('color') || '#f8f8f8'
  }
  set color(newValue: string) {
    this.setAttribute('color', newValue)
  }

  afterCreated() {
    refineCanvasRatioForRetinaDisplay(this.$root)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'color', value: this.color })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'color': {
        fillBackgroundColor(this.$root, value)
        break
      }
    }
  }
}
