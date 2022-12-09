const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      background-color: #D8D8D8;
    }

    ::slotted([slot="main"]) {
      max-width: 780px;
      height: 100%;
      margin: 0 auto;
      background-color: #FFFFFF;
    }
  </style>
  <slot name="main">main slot</slot>
`

export default class MobileTemplate extends HTMLElement {
  private $root: ShadowRoot

  static tag = 'v-mobile-layout'

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
    this.$root.appendChild(template.content.cloneNode(true))
  }
}
