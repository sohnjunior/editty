import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host figure {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      margin: 0;
      width: fit-content;
    }

    :host figure.selected .figure-content {
      border: 2px solid var(--color-primary30);
    }

    :host figure > .figure-content {
      position: relative;
      box-sizing: border-box;
      border: 2px solid var(--color-gray);
      border-radius: 13px;
      width: 100px;
      height: 100px;
    }

    :host figure > .figure-content > v-icon {
      position: absolute;
      top: 0px;
      right: 0px;
    }

    :host figcaption {
      margin-top: 8px;
      font-size: 13px;
      font-weight: 500;
    }
  </style>
  <figure>
    <div class="figure-content">
      <v-icon icon="close-circle" size="xlarge"></v-icon>
    </div>
    <figcaption></figcaption>
  </figure>
`

export default class VCanvasPreview extends VComponent {
  static tag = 'v-canvas-preview'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['caption', 'selected']
  }

  get caption() {
    return this.getAttribute('caption') || ''
  }
  set caption(newValue: string) {
    this.setAttribute('caption', newValue)
  }

  get selected() {
    return this.getAttribute('selected') === 'true'
  }
  set selected(newValue: boolean) {
    this.setAttribute('selected', `${newValue}`)
  }

  protected bindEventListener() {
    this.$root
      .querySelector('v-icon[icon="close-circle"]')
      ?.addEventListener('click', this.handleClickCloseIcon.bind(this))
  }

  private handleClickCloseIcon(ev: Event) {
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('preview:delete', { bubbles: true, composed: true }))
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'caption':
        this.updateFigureCaption(value)
        break
      case 'selected':
        this.updateSelectedProp(value)
        break
    }
  }

  private updateFigureCaption(value: string) {
    const $caption = this.$root.querySelector('figcaption')
    if ($caption) {
      $caption.textContent = value
    }
  }

  private updateSelectedProp(newValue: string) {
    if (newValue === 'true') {
      this.$root.classList.add('selected')
    } else {
      this.$root.classList.remove('selected')
    }
  }
}
