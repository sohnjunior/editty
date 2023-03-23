import MobileLayout from '@layouts/mobile'
import Button from '@atoms/button/button'
import Canvas from '@atoms/canvas/canvas'
import Icon from '@atoms/icon/icon'
import Container from '@atoms/container/container'
import TextInput from '@atoms/text-input/text-input'
import IconButton from '@molecules/icon-button/icon-button'
import ControlContainer from '@molecules/control-container/control-container'
import HistoryContainer from '@molecules/history-container/history-container'
import InputContainer from '@molecules/input-container/input-container'
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
