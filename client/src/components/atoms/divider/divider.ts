import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host hr {
      display: block;
      margin: 0;
      background-color: var(--color-platinum);
      border: none;
      height: 5px;
      width: 100%;
    }
  </style>
  <hr></hr>
`

export default class VDivider extends VComponent {
  static tag = 'v-divider'

  static get observedAttributes() {
    return ['size', 'spacing']
  }

  get size() {
    return this.getAttribute('size') || '5px'
  }

  get spacing() {
    return this.getAttribute('spacing') || '0px'
  }

  constructor() {
    super(template)
  }

  bindInitialStyle() {
    this.updateStyle({ attribute: 'size', value: this.size })
    this.updateStyle({ attribute: 'spacing', value: this.spacing })
  }

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'size':
        this.$root.style.height = value
        break
      case 'spacing':
        this.$root.style.margin = `${value} 0px`
        break
    }
  }
}
