import { VComponent } from '@/modules/v-component'
import { CanvasContext } from '@/contexts/canvas-context/context'
import { EventBus, EVENT_KEY } from '@/event-bus'

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
  </v-container>
`

export default class VHistoryToolbox extends VComponent {
  static tag = 'v-history-toolbox'

  constructor() {
    super(template)
  }

  connectedCallback() {
    const initEvents = () => {
      const $container = this.$shadow.querySelector('v-container')

      $container?.addEventListener('click', (e) => {
        const $target = e.target as HTMLElement

        switch ($target.dataset.icon) {
          case 'back':
            CanvasContext.dispatch({ action: 'HISTORY_BACK' })
            break
          case 'forward':
            CanvasContext.dispatch({ action: 'HISTORY_FORWARD' })
            break
          case 'trash': {
            const isConfirmed = window.confirm(
              '지금까지 작성한 기록이 사라집니다. 삭제하시겠습니까?'
            )
            isConfirmed && EventBus.getInstance().emit(EVENT_KEY.CLEAR_ALL)
            break
          }
          default:
            return
        }
      })
    }

    initEvents()
  }
}
