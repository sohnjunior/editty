import { VComponent } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <v-menu width="200px">
    <v-color-palette slot="content"></v-color-palette>
  </v-menu>
`

export default class VDrawOptionMenu extends VComponent {
  static tag = 'v-color-menu'
  private $menu!: HTMLElement

  static get observedAttributes() {
    return ['open']
  }

  get openAttribute() {
    return this.getAttribute('open') || 'false'
  }

  constructor() {
    const initInnerElement = () => {
      const $menu = this.$shadow.querySelector('v-menu')
      if (!$menu) {
        throw new Error('initialize fail')
      }

      this.$menu = $menu as HTMLElement
    }

    super(template)
    initInnerElement()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'open') {
      this.$menu.setAttribute('open', newValue)
    }
  }
}
