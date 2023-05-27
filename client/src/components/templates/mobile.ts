import { VComponent } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      background-color: var(--color-gray);
      user-select: none;
    }

    ::slotted([slot="main"]) {
      max-width: 1024px;
      height: 100%;
      margin: 0 auto;
    }
  </style>
  <slot name="main">main</slot>
`

export default class MobileTemplate extends VComponent {
  static tag = 'v-mobile-layout'

  constructor() {
    super(template)
  }
}
