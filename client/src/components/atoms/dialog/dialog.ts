import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host dialog {
      display: flex;
      flex-direction: column;
      background: var(--color-white);
      border-radius: 20px;
      border: none;
      filter: drop-shadow(0px 9px 17px rgba(125, 159, 192, 0.12));
      width: 200px;
      padding: 32px;
    }

    :host .dialog-title {
      color: var(--color-black);
      font-weight: 600;
      font-size: 18px;
      text-align: center;
      margin: 0 0 20px;
    }

    :host .dialog-content {
      color: var(--color-davy-gray);
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      margin: 0 0 10px;
    }

    :host .dialog-action {
      margin-top: 10px;
    }

    :host ::slotted([slot="action"]) {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  </style>
  <dialog>
    <h1 class="dialog-title">
      <slot name="title"></slot>
    </h1>
    <section class="dialog-content">
      <slot name="content"></slot>
    </section>
    <section class="dialog-action">
      <slot name="action"></slot>
    </section>
  </dialog>
`

export default class VDialog extends VComponent<HTMLDialogElement> {
  static tag = 'v-dialog'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['open']
  }

  get open() {
    return this.getAttribute('open') === 'true' ? 'true' : 'false'
  }
  set open(newValue: 'true' | 'false') {
    this.setAttribute('open', newValue)
  }

  protected bindEventListener() {
    this.$root.addEventListener('cancel', (ev) => ev.preventDefault())
  }

  protected bindInitialProp() {
    this.reflectAttribute({ attribute: 'open', value: this.open })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'open':
        this.updateOpenStyle(value)
        break
    }
  }

  private updateOpenStyle(value: string) {
    if (value === 'true') {
      this.$root.showModal()
    } else {
      this.$root.close()
    }
  }
}
