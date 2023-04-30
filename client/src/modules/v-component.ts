export abstract class VComponent extends HTMLElement {
  static tag: string
  protected $shadow!: ShadowRoot

  constructor(template: HTMLTemplateElement) {
    const initShadowRoot = () => {
      this.$shadow = this.attachShadow({ mode: 'open' })
      this.$shadow.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }

  // protected connectedCallback() {
  //   this.initEvents()
  // }

  // /**
  //  * Define event listeners to assign to this component.
  //  * @example
  //  *  this.addEventListener('mousedown', this.setup)
  //  */
  // initEvents() {
  //   return undefined
  // }
}
