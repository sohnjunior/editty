export default class Button extends HTMLElement {
  private $root: ShadowRoot

  static displayName = 'atom-button'
  static get observedAttributes() {
    return ['color']
  }

  get color() {
    return this.getAttribute('color')
  }

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  template() {
    return `
      <style>
        :host > button {
          color: ${this.color}
        }
      </style>
      <button>버튼</button>
    `
  }

  render() {
    this.$root.innerHTML = this.template()
  }
}
