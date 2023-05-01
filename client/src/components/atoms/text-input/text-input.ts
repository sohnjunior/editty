import { VComponent } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > input[type="text"] {
      border: none;
      padding: 8px 10px;
      outline: none;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.15em;
      background-color: transparent;
    }
  </style>
  <input type="text" />
`

export default class VTextInput extends VComponent<HTMLInputElement> {
  static tag = 'v-text-input'

  static get observedAttributes() {
    return ['placeholder']
  }

  get value() {
    return this.$root.value
  }

  get placeHolderAttribute() {
    return this.getAttribute('placeholder')
  }

  constructor() {
    super(template)
  }

  connectedCallback() {
    const initEvents = () => {
      this.$root.addEventListener('input', (e) => {
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
        this.$root.setAttribute('placeholder', value)
        break
    }
  }
}
