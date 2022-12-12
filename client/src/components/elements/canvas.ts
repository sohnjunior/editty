const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    #canvas {
      width: 100%;
      height: 100%;
    }
  </style>
  <canvas id="canvas"></canvas>
`

export default class VCanvas extends HTMLElement {
  private $root!: ShadowRoot
  private $canvas!: HTMLCanvasElement
  private context!: CanvasRenderingContext2D

  static tag = 'v-canvas'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initCanvas = () => {
      this.$canvas = this.$root.getElementById('canvas') as HTMLCanvasElement
      const ctx = this.$canvas.getContext('2d')
      if (!ctx) {
        throw new Error('🚨 canvas load fail')
      }
      this.context = ctx
    }

    const refineCanvasRatio = () => {
      const ratio = window.devicePixelRatio
      const { width, height } = getComputedStyle(this.$canvas)
      this.$canvas.width = parseInt(width) * ratio
      this.$canvas.height = parseInt(height) * ratio
    }

    super()
    initShadowRoot()
    initCanvas()
    refineCanvasRatio()
  }

  connectedCallback() {
    this.context.fillStyle = 'rgba(0, 0, 200, 0.5)'
    this.context.fillRect(30, 30, 50, 50)
  }
}
