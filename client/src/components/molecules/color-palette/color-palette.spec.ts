import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { getTemplateRootElement } from '@/modules/wc-dom'

import ColorTile from '@/components/atoms/color-tile/color-tile'
import ColorPalette from './color-palette'

describe('color-palette', () => {
  beforeAll(() => {
    customElements.define(ColorTile.tag, ColorTile)
    customElements.define(ColorPalette.tag, ColorPalette)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should propagate selected color', async () => {
    document.body.innerHTML = `
      <v-color-palette data-testid="color-palette"></v-color-palette>
    `

    const colorPaletteElement = screen.getByTestId('color-palette')
    const rootElement = getTemplateRootElement<HTMLDivElement>(colorPaletteElement)
    const colorTileElement = rootElement.querySelector(
      'v-color-tile[color="golden-sand"]'
    ) as HTMLElement

    let selectedColor = ''
    const mockListener = jest.fn((ev: Event) => {
      selectedColor = (ev as CustomEvent).detail.value
    })
    colorPaletteElement.addEventListener('select:color', mockListener)

    const user = userEvent.setup()
    await user.click(colorTileElement)

    expect(selectedColor).toBe('golden-sand')
  })
})
