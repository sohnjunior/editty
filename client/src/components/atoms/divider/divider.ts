import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host hr {
      display: block;
      background-color: var(--color-platinum);
      border: none;
      width: 100%;
    }
  </style>
  <hr></hr>
`

export default class VDivider extends VComponent {
  static tag = 'v-divider'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['size', 'spacing']
  }

  get size() {
    return this.getAttribute('size') || '5px'
  }
  set size(newValue: string) {
    this.setAttribute('size', newValue)
  }

  get spacing() {
    return this.getAttribute('spacing') || '0px'
  }
  set spacing(newValue: string) {
    this.setAttribute('spacing', newValue)
  }

  protected bindInitialProp() {
    this.reflectAttribute({ attribute: 'size', value: this.size })
    this.reflectAttribute({ attribute: 'spacing', value: this.spacing })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    console.log('aa')
    switch (attribute) {
      case 'size':
        this.updateSizeStyle(value)
        break
      case 'spacing':
        this.updateSpacingStyle(value)
        break
    }
  }

  private updateSizeStyle(value: string) {
    this.$root.style.height = value
  }

  private updateSpacingStyle(value: string) {
    this.$root.style.margin = `${value} 0px`
  }
}
