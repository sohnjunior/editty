import { VComponent } from '@/modules/v-component'

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

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'color': {
        const $button = this.$root.querySelector('button')
        $button && ($button.style.color = newValue)
      }
    }
  }
}
