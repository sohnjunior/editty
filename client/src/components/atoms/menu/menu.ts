import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <v-container>
    <slot name="content"></slot>
  </v-container>
`

export default class VMenu extends VComponent {
  static tag = 'v-menu'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['open', 'width']
  }

  get open() {
    const flag = this.getAttribute('open')
    return flag === 'true' ? 'true' : 'false'
  }
  set open(newValue: 'true' | 'false') {
    this.setAttribute('open', newValue)
  }

  get width() {
    return this.getAttribute('width') || '0px'
  }
  set width(newValue: string) {
    this.setAttribute('width', newValue)
  }

  bindInitialProp() {
    this.reflectAttribute({ attribute: 'open', value: this.open })
    this.reflectAttribute({ attribute: 'width', value: this.width })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'open':
        this.updateOpenProp(value)
        break
      case 'width':
        this.updateWidthStyle(value)
        break
    }
  }

  private updateOpenProp(value: string) {
    this.setVisibility(value)
    this.setOverlayEvent(value)
  }

  private updateWidthStyle(value: string) {
    this.$root.style.minWidth = value
  }

  setVisibility(open: string) {
    if (open === 'true') {
      this.$root.style.display = 'block'
    } else {
      this.$root.style.display = 'none'
    }
  }

  setOverlayEvent(open: string) {
    const onOpenHandler = this.onOpen
    const onCloseHandler = this.onClose.bind(this)

    if (open === 'true') {
      this.$root.addEventListener('mousedown', onOpenHandler)
      this.$root.addEventListener('touchstart', onOpenHandler)
      /** HACK: document event listener 가 attribute update 이후에 추가되도록 rAF 활용 */
      requestAnimationFrame(() => {
        document.addEventListener('mousedown', onCloseHandler, { once: true })
        document.addEventListener('touchstart', onCloseHandler, { once: true })
      })
    } else {
      this.$root.removeEventListener('mousedown', onOpenHandler)
      this.$root.removeEventListener('touchstart', onOpenHandler)
    }
  }

  onOpen(ev: Event) {
    ev.stopPropagation()
  }

  onClose() {
    this.dispatchEvent(new CustomEvent('close:menu', { bubbles: true, composed: true }))
  }
}
