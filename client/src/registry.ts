import MobileLayout from '@templates/mobile'
import Button from '@atoms/button/button'
import ColorTile from '@atoms/color-tile/color-tile'
import Container from '@atoms/container/container'
import Icon from '@atoms/icon/icon'
import Menu from '@atoms/menu/menu'
import TextInput from '@atoms/text-input/text-input'
import RangeSlider from '@atoms/range-slider/range-slider'
import Divider from '@atoms/divider/divider'
import CanvasPreview from '@atoms/canvas-preview/canvas-preview'
import IconButton from '@molecules/icon-button/icon-button'
import CanvasBackgroundLayer from '@molecules/canvas-layer/background-layer'
import CanvasDrawingLayer from '@molecules/canvas-layer/drawing-layer'
import CanvasImageLayer from '@molecules/canvas-layer/image-layer'
import InputContainer from '@molecules/input-container/input-container'
import ColorPalette from '@molecules/color-palette/color-palette'
import ColorMenu from '@molecules/color-menu/color-menu'
import StrokeMenu from '@molecules/stroke-menu/stroke-menu'
import ArchiveMenu from '@molecules/archive-menu/archive-menu'
import CanvasContainer from '@organisms/canvas-container/canvas-container'
import CanvasToolbox from '@organisms/canvas-toolbox/canvas-toolbox'
import HistoryToolbox from '@organisms/history-toolbox/history-toolbox'
import App from './app'

export function defineCustomElements() {
  customElements.define(App.tag, App)
  customElements.define(MobileLayout.tag, MobileLayout)
  customElements.define(Menu.tag, Menu)
  customElements.define(Button.tag, Button)
  customElements.define(Icon.tag, Icon)
  customElements.define(ColorTile.tag, ColorTile)
  customElements.define(IconButton.tag, IconButton)
  customElements.define(CanvasPreview.tag, CanvasPreview)
  customElements.define(CanvasContainer.tag, CanvasContainer)
  customElements.define(CanvasBackgroundLayer.tag, CanvasBackgroundLayer)
  customElements.define(CanvasDrawingLayer.tag, CanvasDrawingLayer)
  customElements.define(CanvasImageLayer.tag, CanvasImageLayer)
  customElements.define(Container.tag, Container)
  customElements.define(TextInput.tag, TextInput)
  customElements.define(RangeSlider.tag, RangeSlider)
  customElements.define(Divider.tag, Divider)
  customElements.define(CanvasToolbox.tag, CanvasToolbox)
  customElements.define(HistoryToolbox.tag, HistoryToolbox)
  customElements.define(InputContainer.tag, InputContainer)
  customElements.define(ColorPalette.tag, ColorPalette)
  customElements.define(ColorMenu.tag, ColorMenu)
  customElements.define(StrokeMenu.tag, StrokeMenu)
  customElements.define(ArchiveMenu.tag, ArchiveMenu)
}
