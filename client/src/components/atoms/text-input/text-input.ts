const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > input[type="text"] {
      border: none;
      padding: 8px 10px;
      outline: none;
      font-weight: 500;
      font-size: 16px;
      letter-spacing: 0.15em;
      background-color: transparent;
    }
  </style>
  <input type="text" />
`

export default class VTextInput extends HTMLElement {
  private $root!: ShadowRoot
  private $input!: HTMLInputElement

  static tag = 'v-text-input'
  static get observedAttributes() {
    return ['placeholder']
  }

  get value() {
    return this.$input.value
  }

  get placeHolderAttribute() {
    return this.getAttribute('placeholder')
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initInnerElement = () => {
      const $input = this.$root.querySelector('input[type="text"]')
      if (!$input) {
        throw new Error('initialize fail')
      }

      this.$input = $input as HTMLInputElement
    }

    super()
    initShadowRoot()
    initInnerElement()
  }

  connectedCallback() {
    const initEvents = () => {
      this.$input.addEventListener('input', (e) => {
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: { value: (e.target as HTMLInputElement).value },
          })
        )
      })
    }

    initEvents()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateAttribute({ attribute: name, value: newValue })
  }

  updateAttribute({ attribute, value }: { attribute: string; value: string }) {
    switch (attribute) {
      case 'placeholder':
        this.$input.placeholder = value
    }
  }
}
