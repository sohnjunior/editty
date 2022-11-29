export default class Container extends HTMLElement {
  private $root: ShadowRoot

  static displayName = 'atom-container'

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  template() {
    return `
      <style>
        :host > div {
          width: fit-content;
          padding: 15px 20px;
          background: #fafafa;
          border-radius: 20px;
          filter: drop-shadow(0px 9px 17px rgba(125, 159, 192, 0.12));
        }
      </style>
      <div>
        <slot></slot>
      </div>
    `
  }

  render() {
    this.$root.innerHTML = this.template()
  }
}
