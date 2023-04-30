import { VComponent } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: fit-content;
      padding: 15px 20px;
      background: var(--color-white);
      border-radius: 20px;
      filter: drop-shadow(0px 9px 17px rgba(125, 159, 192, 0.12));
    }
  </style>
  <slot></slot>
`

export default class VContainer extends VComponent {
  static tag = 'v-container'

  constructor() {
    super(template)
  }
}
