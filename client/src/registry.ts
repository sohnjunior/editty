import MobileLayout from '@layouts/mobile'
import Button from '@atoms/button'

export function defineCustomElements() {
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Button.tag, Button)
}
