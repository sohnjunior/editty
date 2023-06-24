import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VIcon from '@atoms/icon/icon'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host .toast-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px;
      border-radius: 16px;
      width: 270px;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.3s;
      transition: transform 0.2s;
    }

    :host .open {
      opacity: 1;
      transform: translateY(0px);
    }

    :host .toast-content {
      display: flex;
      flex-direction: column;
      margin-left: 16px;
    }

    :host h1 {
      font-weight: 700;
      font-size: 12px;
      line-height: 16px;
      color: #1F2024;
      margin: 0;
    }

    :host p {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #494A50;
      margin: 0;
    }
  </style>
  <div class="toast-container">
    <v-icon size="large"></v-icon>
    <div class="toast-content">
      <h1>
        <span id="title"></span>
      </h1>
      <p>
        <span id="description"></span>
      </p>
    </div>
  </div>
`

export default class VToast extends VComponent {
  static tag = 'v-toast'

  private autocloseTimerId?: number

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['variant', 'open', 'autoclose', 'title', 'description']
  }

  get variant() {
    return this.getAttribute('variant') || 'success'
  }
  set variant(newValue: string) {
    this.setAttribute('variant', newValue)
  }

  get open() {
    return this.getAttribute('open') === 'true'
  }
  set open(newValue: boolean) {
    this.setAttribute('open', `${newValue}`)
  }

  get autoclose() {
    return this.getAttribute('autoclose') === 'true'
  }
  set autoclose(newValue: boolean) {
    this.setAttribute('autoclose', `${newValue}`)
  }

  get title() {
    return this.getAttribute('title') || ''
  }
  set title(newValue: string) {
    this.setAttribute('title', newValue)
  }

  get description() {
    return this.getAttribute('description') || ''
  }
  set description(newValue: string) {
    this.setAttribute('description', newValue)
  }

  protected bindInitialProp() {
    this.reflectAttribute({ attribute: 'variant', value: this.variant })
    this.reflectAttribute({ attribute: 'open', value: `${this.open}` })
    this.reflectAttribute({ attribute: 'title', value: this.title })
    this.reflectAttribute({ attribute: 'description', value: this.description })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'variant':
        this.updateVariantStyle(value)
        break
      case 'open':
        this.updateOpenStyle(value)
        break
      case 'title':
        this.updateTitleContent(value)
        break
      case 'description':
        this.updateDescriptionContent(value)
        break
    }
  }

  private updateVariantStyle(value: string) {
    const colorMap: Record<string, string> = {
      success: 'var(--color-success)',
      fail: 'var(--color-danger)',
    }
    this.$root.style.backgroundColor = colorMap[value]

    const $icon = this.$root.querySelector<VIcon>('v-icon')
    if ($icon) {
      $icon.setAttribute('icon', value)
    }
  }

  private updateOpenStyle(value: string) {
    if (value === 'true') {
      this.$root.style.display = 'flex'
      requestAnimationFrame(() => {
        this.$root.classList.add('open')
        this.setAutocloseTimer()
      })
    } else {
      this.$root.classList.remove('open')
      this.$root.style.display = 'none'
    }
  }

  private setAutocloseTimer() {
    const alreadyTimerExecuting = this.autocloseTimerId !== undefined
    if (!alreadyTimerExecuting && this.autoclose) {
      this.autocloseTimerId = window.setTimeout(() => {
        this.open = false
        this.autocloseTimerId = undefined
      }, 2200)
    }
  }

  private updateTitleContent(value: string) {
    const $title = this.$root.querySelector('#title')
    if ($title) {
      $title.textContent = value
    }
  }

  private updateDescriptionContent(value: string) {
    const $description = this.$root.querySelector('#description')
    if ($description) {
      $description.textContent = value
    }
  }
}
