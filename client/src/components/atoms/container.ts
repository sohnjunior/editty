const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      all: unset;
      width: fit-content;
      padding: 15px 20px;
      background: #fafafa;
      border-radius: 20px;
      filter: drop-shadow(0px 9px 17px rgba(125, 159, 192, 0.12));
    }
  </style>
  <slot></slot>
`

export default class Container extends HTMLElement {
  private $root: ShadowRoot

  static tag = 'v-container'

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
    this.$root.appendChild(template.content.cloneNode(true))
  }
}
