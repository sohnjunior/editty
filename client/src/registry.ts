import MobileLayout from '@layouts/mobile'
import Button from '@/components/elements/button'
import Canvas from '@/components/elements/canvas'

export function defineCustomElements() {
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Button.tag, Button)
  customElements.define(Canvas.tag, Canvas)
}
