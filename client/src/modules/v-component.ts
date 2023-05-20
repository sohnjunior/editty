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

      if (elements.length !== 1) {
        throw new Error('🚨 v-component must contain one root element')
      }

      this.$root = elements[0] as R
    }

    super()
    initShadowRoot()
    initRootElement()
    this.afterCreated()
  }

  /**
   * Define functions to be called after object creation
   */
  protected afterCreated() {
    return
  }

  protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      // skip update if no difference
      return
    }

    // TODO: 하나의 함수로 합치고, 관심사의 분리는 개별 컴포넌트에서 수행하도록 변경하기
    this.updateStyle({ attribute: name, value: newValue })
    this.updateProperty({ attribute: name, value: newValue })

    // 첫 렌더링에 자식 DOM 인스턴스 참조가 안되는 이슈 우회
    requestAnimationFrame(() => this.reflectAttribute({ attribute: name, value: newValue }))
  }

  protected connectedCallback() {
    // HACK: dom mount 이후에 속성 가져와서 스타일적용하기 위해 이벤트루프 사용
    requestAnimationFrame(this.bindInitialStyle.bind(this))
    this.bindEventListener()
    this.subscribeEventBus()
    this.subscribeContext()

    this.afterMount()
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
   *  this.$root.addEventListener('mousedown', this.handler)
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
   * Define functions to be called after component DOM mounted
   */
  protected afterMount() {
    return
  }

  /**
   * @deprecated
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
   * @deprecated
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

  /**
   * Defines handlers to invoke when the _observedAttributes_ changed
   */
  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    return
  }
}

export interface ReflectAttributeParam {
  attribute: string
  value: string
}
export type UpdateStyleParam = Parameters<VComponent['updateStyle']>[0]
export type UpdatePropertyParam = Parameters<VComponent['updateProperty']>[0]
