import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam } from '@/modules/v-component'

const template = document.createElement('template')
template.innerHTML = `
  <v-container>
    <slot name="content"></slot>
  </v-container>
`

export default class VMenu extends VComponent {
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
    super(template)
  }

  bindInitialStyle() {
    if (this.widthAttribute) {
      this.updateStyle({ attribute: 'width', value: this.widthAttribute })
    }
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

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'width':
        this.$root.style.minWidth = value
        break
    }
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
