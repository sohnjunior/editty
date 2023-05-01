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

  protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      // skip update if no difference
      return
    }

    this.updateStyle({ attribute: name, value: newValue })
    this.updateProperty({ attribute: name, value: newValue })
  }

  protected connectedCallback() {
    this.bindEventListener()
    this.subscribeEventBus()
    this.subscribeContext()
    requestAnimationFrame(this.bindInitialStyle.bind(this)) // HACK: dom mount 이후 속성 가져오지 못하는 이슈 대응
  }

  /**
   *
   * @example
   * bindInitialStyle() {
   *  this.fillColor(this.colorAttribute)
   * }
   */
  bindInitialStyle() {
    return
  }

  /**
   * Define event listener to assign to this component.
   * @example
   * bindEventListener() {
   *  this.addEventListener('mousedown', this.handler)
   * }
   */
  bindEventListener() {
    return
  }

  /**
   * Define the event bus that the component subscribes to.
   * @example
   * subscribeEventBus() {
   *   EventBus.getInstance().on(EVENT_KEY.CLEAR_ALL, () => {...})
   * }
   */
  subscribeEventBus() {
    return
  }

  /**
   * Define the context events that the component subscribes to.
   * @example
   * subscribeContext() {
   *  CanvasContext.subscribe({
   *    action: 'PUSH_STATE',
   *    effect: (context) => {...}
   *  })
   * }
   */
  subscribeContext() {
    return
  }

  /**
   * Defines when style update is required according to attribute change.
   * @example
   * updateStyle({ attribute, value }) {
   *  switch (attribute) {
   *    case 'color':
   *      this.$root.style.backgroundColor = value
   *      break
   *  }
   * }
   */
  protected updateStyle(param: { attribute: string; value: string }) {
    return
  }

  /**
   * Defines when the attribute value delivered to the internal element needs to be updated according to the root attribute change.
   * @example
   * updateProperty({ attribute, value }) {
   *   switch (attribute) {
   *      case 'placeholder':
   *        this.$root.setAttribute('placeholder', value)
   *        break
   *    }
   * }
   */
  protected updateProperty(param: { attribute: string; value: string }) {
    return
  }
}

export type UpdateStyleParam = Parameters<VComponent['updateStyle']>[0]
export type UpdatePropertyParam = Parameters<VComponent['updateProperty']>[0]
