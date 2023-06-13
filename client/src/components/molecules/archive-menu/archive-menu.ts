import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'
import VCanvasPreview from '@atoms/canvas-preview/canvas-preview'
import type { Archive } from '@/services/archive'

type ArchivePreview = Omit<Archive, 'images'>

const template = document.createElement('template')
template.innerHTML = `
  <style>
    @media screen and (min-width: 421px) { 
      :host div.preview-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        grid-auto-rows: min-content;
        gap: 10px 15px;
        overflow: scroll;
        width: 330px;
        height: 350px;
      }
    }

    @media screen and (max-width: 420px) {
      :host div.preview-container {
        display: grid;
        grid-auto-flow: column;
        grid-template-rows: repeat(2, 1fr); 
        gap: 10px 15px;
        width: 200px;
        height: 270px;
        overflow-x: scroll;
      }
    }

    :host div.add-new-canvas-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid var(--color-gray);
      border-radius: 13px;
      width: 100px;
      height: 100px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }

    :host div.add-new-canvas-button > v-icon {
      margin-bottom: 8px;
    }
  </style>
  <v-menu>
    <div class="preview-container" slot="content">
      <div data-value="add" class="add-new-canvas-button">
        <v-icon icon="add-circle" size="large"></v-icon>
        create!
      </div>
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
    this.updatePreview()
    this.updateValueProp(this.value)
  }

  private updateArchives() {
    const $previews = this.$root.querySelectorAll('v-canvas-preview')
    $previews.forEach(($preview) => $preview.remove())

    const $archiveContainer = this.$root.querySelector('.preview-container')
    if ($archiveContainer) {
      const html = this.archives
        .map(
          (archive) =>
            `<v-canvas-preview selected="false" data-value="${archive.id}" caption="${archive.title}"></v-canvas-preview>`
        )
        .join('')
      $archiveContainer.insertAdjacentHTML('beforeend', html)
    }
  }

  private updatePreview() {
    const $previews = this.$root.querySelectorAll<VCanvasPreview>('v-canvas-preview')
    this.archives.forEach((archive, idx) => {
      const imageData = {
        image: archive.imageSnapshot,
        drawing: archive.snapshot,
      }
      $previews[idx].imageData = imageData
    })
  }

  protected bindEventListener() {
    this.$root.addEventListener('click', this.handleClickArchive)
    this.$root.addEventListener('preview:delete', this.handleDeletePreview.bind(this))
  }

  private handleClickArchive(ev: Event) {
    const value = (ev.target as HTMLElement).dataset.value
    if (!value) {
      return
    }

    if (value === 'add') {
      this.dispatchEvent(
        new CustomEvent('add:archive', {
          bubbles: true,
          composed: true,
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent('select:archive', {
          detail: { value },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  private handleDeletePreview(ev: Event) {
    const sid = (ev.target as HTMLElement).dataset.value

    this.dispatchEvent(
      new CustomEvent('delete:archive', {
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
