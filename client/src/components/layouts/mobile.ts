const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      background-color: var(--color-gray);
    }

    ::slotted([slot="main"]) {
      max-width: 780px;
      height: 100%;
      margin: 0 auto;
    }
  </style>
  <slot name="main">main</slot>
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
