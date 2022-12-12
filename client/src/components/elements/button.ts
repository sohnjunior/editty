const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host > button {
    color: blue;
  }
  </style>
  <button>버튼</button>
`

export default class VButton extends HTMLElement {
  private $root: ShadowRoot

  static tag = 'v-button'
  static get observedAttributes() {
    return ['color']
  }

  get color() {
    /** TODO: getter - setter @Prop 으로 변경 */
    return this.getAttribute('color')
  }

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
    this.$root.appendChild(template.content.cloneNode(true))
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
