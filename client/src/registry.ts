import MobileLayout from '@layouts/mobile'
import Button from '@elements/button'
import Canvas from '@elements/canvas'
import IconButton from '@elements/icon-button'
import Container from '@elements/container'
import ControlContainer from '@molecules/control-container'
import App from './app'

export function defineCustomElements() {
  customElements.define(App.tag, App)
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Button.tag, Button)
  customElements.define(IconButton.tag, IconButton)
  customElements.define(Canvas.tag, Canvas)
  customElements.define(Container.tag, Container)
  customElements.define(ControlContainer.tag, ControlContainer)
}
