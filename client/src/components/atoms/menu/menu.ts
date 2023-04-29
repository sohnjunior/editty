const template = document.createElement('template')
template.innerHTML = `
  <v-container class="menu">
    <slot name="content"></slot>
  </v-container>
`

export default class VMenu extends HTMLElement {
  private $root!: ShadowRoot
  private $container!: HTMLElement

  static tag = 'v-menu'

  static get observedAttributes() {
    return ['open', 'width']
  }

  get openAttribute() {
    return this.getAttribute('open') || 'false'
  }

  get widthAttribute() {
    return this.getAttribute('width') || '150px'
  }

  constructor() {
    const initShadowRoot = () => {
      this.$root = this.attachShadow({ mode: 'open' })
      this.$root.appendChild(template.content.cloneNode(true))
    }

    const initInnerElement = () => {
      const $container = this.$root.querySelector('v-container')
      if (!$container) {
        throw new Error('initialize fail')
      }

      this.$container = $container as HTMLElement
    }

    super()
    initShadowRoot()
    initInnerElement()
  }

  connectedCallback() {
    const initStyle = () => {
      if (this.widthAttribute) {
        this.updateStyle({ attribute: 'width', value: this.widthAttribute })
      }
    }

    requestAnimationFrame(initStyle)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      // ignore open -> open, close -> close state change request
      return
    }

    switch (name) {
      case 'open':
        this.setVisibility(newValue)
        this.setOverlayEvent(newValue)
        break
      case 'width':
        this.updateStyle({ attribute: name, value: newValue })
        break
    }
  }

  updateStyle({ attribute, value }: { attribute: string; value: string }) {
    switch (attribute) {
      case 'width':
        this.$container.style.maxWidth = value
        break
    }
  }

  setVisibility(open: string) {
    if (open === 'true') {
      this.$container.style.display = 'block'
    } else {
      this.$container.style.display = 'none'
    }
  }

  setOverlayEvent(open: string) {
    const onTriggerHandler = this.onOpen
    const onCloseHandler = this.onClose.bind(this)

    if (open === 'true') {
      this.$container.addEventListener('click', onTriggerHandler)
      /** HACK: document event listener 가 attribute update 이후에 추가되도록 rAF 활용 */
      requestAnimationFrame(() =>
        document.addEventListener('click', onCloseHandler, { once: true })
      )
    } else {
      this.$container.removeEventListener('click', onTriggerHandler)
      document.removeEventListener('click', onCloseHandler)
    }
  }

  onOpen(ev: Event) {
    ev.stopPropagation()
  }

  onClose() {
    this.dispatchEvent(new CustomEvent('close:menu', { bubbles: true, composed: true }))
  }
}
