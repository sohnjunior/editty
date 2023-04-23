import { Z_INDEX } from '@/utils/constant'
import { fillBackgroundColor, refineCanvasRatio } from '../../../modules/canvas.utils'

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

export default class VCanvasBackgroundLayer extends HTMLElement {
  private $root!: ShadowRoot
  private $canvas!: HTMLCanvasElement

  static tag = 'v-canvas-background-layer'

  static get observedAttributes() {
    return ['color']
  }

  get colorAttribute() {
    return this.getAttribute('color') || '#f8f8f8'
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initCanvas = () => {
      this.$canvas = this.$root.getElementById('background-layer') as HTMLCanvasElement
      const ctx = this.$canvas.getContext('2d')
      if (!ctx) {
        throw new Error('🚨 canvas load fail')
      }
    }

    super()
    initShadowRoot()
    initCanvas()
  }

  connectedCallback() {
    const initStyle = () => {
      const { colorAttribute } = this

      if (colorAttribute) {
        fillBackgroundColor(this.$canvas, colorAttribute)
      }
    }

    refineCanvasRatio(this.$canvas)
    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    switch (attribute) {
      case 'color': {
        fillBackgroundColor(this.$canvas, value)
        break
      }
    }
  }
}
