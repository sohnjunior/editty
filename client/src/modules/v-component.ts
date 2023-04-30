export abstract class VComponent<R = HTMLElement> extends HTMLElement {
  static tag: string
  protected $shadow!: ShadowRoot
  protected $root!: R

  constructor(template: HTMLTemplateElement) {
    const initShadowRoot = () => {
      this.$shadow = this.attachShadow({ mode: 'open' })
      this.$shadow.appendChild(template.content.cloneNode(true))
    }
    const initRootElement = () => {
      const children = this.$shadow.children
      const elements = [...children].filter((element) => !(element instanceof HTMLStyleElement))

      if (elements.length > 1) {
        throw new Error('🚨 v-component must contain one root element')
      }

      if (elements.length === 0) {
        throw new Error('🚨 v-component initialization fail')
      }

      this.$root = elements[0] as R
    }

    super()
    initShadowRoot()
    initRootElement()
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
