import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VCanvasPreview from '@atoms/canvas-preview/canvas-preview'
import type { Archive } from '@/services/archive'

type ArchivePreview = Omit<Archive, 'snapshot' | 'images'>

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host div.preview-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr); 
      gap: 10px 15px;
      overflow: scroll;
      width: 330px;
      height: 350px;
    }
  </style>
  <v-menu>
    <div class="preview-container" slot="content">
      <!-- lazy load archives -->
    </div>
  </v-menu>
`
export default class VArchiveMenu extends VComponent {
  static tag = 'v-archive-menu'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['open', 'value']
  }

  get open() {
    return this.getAttribute('open') === 'true'
  }
  set open(newValue: boolean) {
    this.setAttribute('open', `${newValue}`)
  }

  get value() {
    return this.getAttribute('value') || ''
  }
  set value(newValue: string) {
    this.setAttribute('value', newValue)
  }

  private _archives: ArchivePreview[] = []
  get archives() {
    return this._archives
  }
  set archives(newValue: ArchivePreview[]) {
    this._archives = newValue
    this.updateArchives()
    this.updateValueProp(this.value)
  }

  private updateArchives() {
    const $archiveContainer = this.$root.querySelector('.preview-container')
    if ($archiveContainer) {
      $archiveContainer.innerHTML = this.archives
        .map(
          (archive) =>
            `<v-canvas-preview selected="false" data-value="${archive.id}" caption="${archive.title}"></v-canvas-preview>`
        )
        .join('')
    }
  }

  protected bindEventListener() {
    this.$root.addEventListener('click', this.handleClickArchive)
  }

  private handleClickArchive(ev: Event) {
    const sid = (ev.target as HTMLElement).dataset.value
    if (!sid) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('select:archive', {
        detail: { value: sid },
        bubbles: true,
        composed: true,
      })
    )
  }

  protected bindInitialProp() {
    this.reflectAttribute({ attribute: 'open', value: `${this.open}` })
    this.reflectAttribute({ attribute: 'value', value: this.value })
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam): void {
    switch (attribute) {
      case 'open':
        this.updateOpenProp(value === 'true')
        break
      case 'value':
        this.updateValueProp(value)
        break
    }
  }

  private updateOpenProp(newValue: boolean) {
    this.$root.setAttribute('open', `${newValue}`)
  }

  private updateValueProp(newValue: string) {
    const $newSelect = this.$root.querySelector<VCanvasPreview>(
      `v-canvas-preview[data-value="${newValue}"]`
    )
    if ($newSelect) {
      const $oldSelect = this.$root.querySelector<VCanvasPreview>(
        'v-canvas-preview[selected="true"]'
      )
      if ($oldSelect) {
        $oldSelect.selected = false
      }

      $newSelect.selected = true
    }
  }
}
