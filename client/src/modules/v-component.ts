export abstract class VComponent extends HTMLElement {
  static tag: string
  protected $root!: ShadowRoot

  constructor(template: HTMLTemplateElement) {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    super()
    initShadowRoot()
  }
}
