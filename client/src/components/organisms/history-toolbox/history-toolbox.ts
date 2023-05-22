import { VComponent } from '@/modules/v-component'
import {
  CanvasDrawingContext,
  CanvasImageContext,
  CanvasMetaContext,
  ArchiveContext,
} from '@/contexts'
import { EventBus, EVENT_KEY } from '@/event-bus'
import { addOrUpdateArchive } from '@/services/archive'
import type { Archive } from '@/services/archive'
import { lastOf } from '@/utils/ramda'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host > v-container {
      display: flex;
      gap: 14px;
    }
  </style>
  <v-container>
    <v-icon-button data-icon="back" icon="back-arrow" size="medium"></v-icon-button>
    <v-icon-button data-icon="forward" icon="forward-arrow" size="medium"></v-icon-button>
    <v-icon-button data-icon="trash" icon="trash" size="medium"></v-icon-button>
    <v-icon-button data-icon="disk" icon="disk" size="medium"></v-icon-button>
  </v-container>
`

export default class VHistoryToolbox extends VComponent {
  static tag = 'v-history-toolbox'

  get sid() {
    return ArchiveContext.state.sid!
  }

  get title() {
    return CanvasMetaContext.state.title
  }

  get snapshots() {
    return CanvasDrawingContext.state.snapshots
  }

  get images() {
    return CanvasImageContext.state.images
  }

  constructor() {
    super(template)
  }

  bindEventListener() {
    this.$root.addEventListener('click', (e) => {
      const $target = e.target as HTMLElement

      switch ($target.dataset.icon) {
        case 'back':
          this.handleHistoryBack()
          break
        case 'forward':
          this.handleHistoryForward()
          break
        case 'trash':
          this.handleClearCanvas()
          break
        case 'disk':
          this.handleSaveCanvas()
          break
        default:
          return
      }
    })
  }

  handleHistoryBack() {
    CanvasDrawingContext.dispatch({ action: 'HISTORY_BACK' })
  }

  handleHistoryForward() {
    CanvasDrawingContext.dispatch({ action: 'HISTORY_FORWARD' })
  }

  handleClearCanvas() {
    const isConfirmed = window.confirm('지금까지 작성한 기록이 사라집니다. 삭제하시겠습니까?')
    if (isConfirmed) {
      EventBus.getInstance().emit(EVENT_KEY.CLEAR_ALL)
    }
  }

  handleSaveCanvas() {
    const images: Archive['images'] = this.images.map((image) => ({
      dataUrl: image.dataUrl,
      sx: image.sx,
      sy: image.sy,
      width: image.width,
      height: image.height,
    }))
    addOrUpdateArchive({
      id: this.sid,
      title: this.title,
      snapshot: lastOf(this.snapshots),
      images,
    })
  }
}
