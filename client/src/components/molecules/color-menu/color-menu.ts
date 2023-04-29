const template = document.createElement('template')
template.innerHTML = `
  <v-menu width="200px">
    <v-color-palette slot="content"></v-color-palette>
  </v-menu>
`

export default class VDrawOptionMenu extends HTMLElement {
  private $root!: ShadowRoot
  private $menu!: HTMLElement

  static tag = 'v-color-menu'

  static get observedAttributes() {
    return ['open']
  }

  get openAttribute() {
    return this.getAttribute('open') || 'false'
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initInnerElement = () => {
      const $menu = this.$root.querySelector('v-menu')
      if (!$menu) {
        throw new Error('initialize fail')
      }

      this.$menu = $menu as HTMLElement
    }

    super()
    initShadowRoot()
    initInnerElement()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'open') {
      this.$menu.setAttribute('open', newValue)
    }
  }
}
