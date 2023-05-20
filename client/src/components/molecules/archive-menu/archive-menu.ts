import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component'
import VCanvasPreview from '@atoms/canvas-preview/canvas-preview'

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

interface Archive {
  id: string
  title: string
}

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

  private _archives: Archive[] = []
  get archives() {
    return this._archives
  }
  set archives(newValue: Archive[]) {
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
            `<v-canvas-preview selected="false" value="${archive.id}" caption="${archive.title}"></v-canvas-preview>`
        )
        .join('')
    }
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
      `v-canvas-preview[value="${newValue}"]`
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
