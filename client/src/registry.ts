import MobileLayout from '@layouts/mobile'
import Button from '@/components/atoms/button/button'
import Canvas from '@/components/atoms/canvas/canvas'
import Icon from '@/components/atoms/icon/icon'
import IconButton from '@/components/molecules/icon-button/icon-button'
import Container from '@/components/atoms/container/container'
import TextInput from '@/components/atoms/text-input/text-input'
import ControlContainer from '@/components/molecules/control-container/control-container'
import HistoryContainer from '@/components/molecules/history-container/history-container'
import InputContainer from '@/components/molecules/input-container/input-container'
import App from './app'

export function defineCustomElements() {
  customElements.define(App.tag, App)
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Button.tag, Button)
  customElements.define(Icon.tag, Icon)
  customElements.define(IconButton.tag, IconButton)
  customElements.define(Canvas.tag, Canvas)
  customElements.define(Container.tag, Container)
  customElements.define(TextInput.tag, TextInput)
  customElements.define(ControlContainer.tag, ControlContainer)
  customElements.define(HistoryContainer.tag, HistoryContainer)
  customElements.define(InputContainer.tag, InputContainer)
}
