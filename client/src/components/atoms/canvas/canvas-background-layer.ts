import { Z_INDEX } from '@/utils/constant'

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

    super()
    initShadowRoot()
  }

  connectedCallback() {
    const initStyle = () => {
      const { colorAttribute } = this

      if (colorAttribute) {
        this.updateStyle({ attribute: 'color', value: colorAttribute })
      }
    }

    // HACK: dom mount 이후 속성 가져오지 못하는 이슈 대응
    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateStyle({ attribute: name, value: newValue })
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    const $canvas = this.$root.querySelector('canvas')

    if (!$canvas) {
      return
    }

    switch (attribute) {
      case 'color': {
        $canvas.style.backgroundColor = value
        break
      }
    }
  }
}
