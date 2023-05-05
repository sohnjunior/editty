import { VComponent } from '@/modules/v-component'
import type { UpdateStyleParam, UpdatePropertyParam } from '@/modules/v-component'

export type Stroke = 'draw' | 'erase'
function isValidStrokeType(type?: string): type is Stroke {
  return !!type && ['draw', 'erase'].includes(type)
}

const INITIAL_STROKE_SIZE = 10

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host .content-container {
      display: block;
      flex-direction: column;
      align-items: center;
    }

    :host .stroke-select-wrapper {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
      width: 100%;
    }

    :host v-icon-button[data-selected="true"] {
      border-radius: 3px;
      background-color: var(--color-primary40);
    }

    :host .stroke-resize-slider-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    :host .preview {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 20px;
      margin-right: 10px;
    }

    :host .preview > .circle {
      width: ${INITIAL_STROKE_SIZE}px;
      height: ${INITIAL_STROKE_SIZE}px;
      border: none;
      border-radius: 50%;
      background-color: var(--color-neutral);
    }
  </style>

  <v-menu width="120px">
    <div slot="content" class="content-container">
      <div class="stroke-select-wrapper">
        <v-icon-button data-selected="false" data-phase="draw" icon="draw" size="large"></v-icon-button>
        <v-icon-button data-selected="false" data-phase="erase" icon="erase" size="large"></v-icon-button>
      </div>
      <v-divider size="0.5px" spacing="10px"></v-divider>
      <div class="stroke-resize-slider-wrapper">
        <div class="preview">
          <div class="circle"></div>
        </div>
        <v-range-slider min="5" max="15" value="${INITIAL_STROKE_SIZE}"></v-range-slider>
      </div>
    </div>
  </v-menu>
`

export default class VStrokeMenu extends VComponent {
  static tag = 'v-stroke-menu'
  private _stroke: Stroke = 'draw'

  static get observedAttributes() {
    return ['open', 'stroke']
  }

  get open() {
    return this.$root.getAttribute('open') || 'false'
  }

  get stroke() {
    return this._stroke
  }

  constructor() {
    super(template)
  }

  bindEventListener() {
    this.$root.addEventListener('input', this.handleChangeStrokeSize.bind(this))
    this.$shadow
      .querySelector('.stroke-select-wrapper')
      ?.addEventListener('click', this.handleSelectStroke.bind(this))
  }

  handleChangeStrokeSize(ev: Event) {
    const value = (ev.target as HTMLInputElement).value
    this.updateStyle({ attribute: 'strokeSize', value })
    this.dispatchEvent(
      new CustomEvent('stroke:resize', { detail: { value }, bubbles: true, composed: true })
    )
  }

  handleSelectStroke(ev: Event) {
    const oldPhase = this.stroke
    const newPhase = (ev.target as HTMLElement).dataset.phase
    if (!isValidStrokeType(newPhase) || newPhase === oldPhase) {
      return
    }

    this.selectStroke(newPhase)
    this.dispatchEvent(
      new CustomEvent('stroke:select', {
        detail: { value: newPhase },
        bubbles: true,
        composed: true,
      })
    )
  }

  updateStyle({ attribute, value }: UpdateStyleParam) {
    switch (attribute) {
      case 'strokeSize': {
        this.updateStrokeSizePreview(value)
        break
      }
    }
  }

  private updateStrokeSizePreview(value: string) {
    const $preview = this.$root.querySelector('.preview > .circle') as HTMLElement
    if ($preview) {
      $preview.style.width = `${value}px`
      $preview.style.height = `${value}px`
    }
  }

  updateProperty({ attribute, value }: UpdatePropertyParam) {
    switch (attribute) {
      case 'open':
        this.$root.setAttribute('open', value)
        break
      case 'stroke':
        isValidStrokeType(value) && this.selectStroke(value)
        break
    }
  }

  private selectStroke(newPhase: Stroke) {
    const oldPhase = this.stroke
    const $oldSelected = this.$root.querySelector(`[data-phase="${oldPhase}"]`) as HTMLElement
    $oldSelected.dataset.selected = 'false'

    const $selected = this.$root.querySelector(`[data-phase="${newPhase}"]`) as HTMLElement
    $selected.dataset.selected = 'true'

    this._stroke = newPhase
  }
}
