import { VComponent } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <v-menu width="200px">
    <v-color-palette slot="content"></v-color-palette>
  </v-menu>
`

export default class VDrawOptionMenu extends VComponent {
  static tag = 'v-color-menu'

  static get observedAttributes() {
    return ['open']
  }

  get openAttribute() {
    return this.getAttribute('open') || 'false'
  }

  constructor() {
    super(template)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'open') {
      this.$root.setAttribute('open', newValue)
    }
  }
}
