const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: fit-content;
      padding: 15px 20px;
      background: #fafafa;
      border-radius: 20px;
      filter: drop-shadow(0px 9px 17px rgba(125, 159, 192, 0.12));
    }
  </style>
  <slot></slot>
`

export default class VContainer extends HTMLElement {
  private $root!: ShadowRoot

  static tag = 'v-container'

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
