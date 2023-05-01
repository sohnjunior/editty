import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host > button {
    color: blue;
  }
  </style>
  <button>
    <slot></slot>
  </button>
`

export default class VButton extends VComponent {
  static tag = 'v-button'
  static get observedAttributes() {
    return ['color']
  }

  get color() {
    /** TODO: getter - setter @Prop 으로 변경 */
    return this.getAttribute('color')
  }

  constructor() {
    super(template)
  }

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'color': {
        const $button = this.$shadow.querySelector('button')
        if ($button) {
          $button.style.color = value
        }
      }
    }
  }
}
