export default class TextBox extends HTMLElement {
  static displayName = 'text-box'

  private $root: ShadowRoot

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  template() {
    return `<div>text</div>`
  }

  render() {
    this.$root.innerHTML = this.template()
  }
}
