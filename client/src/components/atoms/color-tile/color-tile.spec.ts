import ColorTile from './color-tile'
import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement, getInitialStyle } from '@/modules/wc-test-utils'

describe('color-tile', () => {
  it('should accept color attribute', async () => {
    const color = {
      name: 'anakiwa',
      rgb: 'rgb(142, 202, 230)',
    }

    await renderToHtml(`
      <v-color-tile data-testid="color-tile" color="${color.name}"></v-color-tile>
    `)

    const colorTile = screen.getByTestId('color-tile') as ColorTile
    const rootElement = getTemplateRootElement<HTMLDivElement>(colorTile)
    const style = await getInitialStyle(rootElement)

    expect(style.backgroundColor).toBe(color.rgb)
  })

  it('should accept size attribute', async () => {
    await renderToHtml(`
      <v-color-tile data-testid="color-tile" color="anakiwa" size="20px"></v-color-tile>
    `)

    const colorTile = screen.getByTestId('color-tile')
    const rootElement = getTemplateRootElement<HTMLDivElement>(colorTile)
    const style = await getInitialStyle(rootElement)

    expect(style.width).toBe('20px')
    expect(style.height).toBe('20px')
  })
})
