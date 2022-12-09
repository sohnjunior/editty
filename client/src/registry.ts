import MobileLayout from '@layouts/mobile'
import Button from '@atoms/button'
import Canvas from '@atoms/canvas'

export function defineCustomElements() {
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Button.tag, Button)
  customElements.define(Canvas.tag, Canvas)
}
