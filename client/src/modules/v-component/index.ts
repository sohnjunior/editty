import type { ReflectAttributeParam } from './types'

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
   * You cannot access DOM instance yet!
   */
  protected afterCreated() {
    return
  }

  /**
   * Called when _observedAttributes_ changed.
   * It also called after DOM init with attributes that declared on web component.
   */
  protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      // skip update if no difference
      return
    }

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
   * Define reflecting style rule derived from initial attribute
   * @example
   * bindInitialStyle() {
   *  this.reflectAttribute({...})
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
   * You can access DOM instance now 😄
   */
  protected afterMount() {
    return
  }

  /**
   * Defines handlers to invoke when the _observedAttributes_ changed
   */
  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    return
  }
}
