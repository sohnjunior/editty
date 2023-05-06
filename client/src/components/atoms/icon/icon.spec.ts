import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'

describe('icon', () => {
  it('should render icon with medium size', async () => {
    await renderToHtml(`
      <v-icon data-testid="icon" icon="emoji" size="medium"></v-icon>
    `)

    const iconElement = screen.getByTestId('icon')
    const rootElement = getTemplateRootElement<HTMLDivElement>(iconElement)

    expect(iconElement.style.backgroundImage).toBeDefined()
    expect(rootElement.style.width).toBe('15px')
    expect(rootElement.style.height).toBe('15px')
  })
})
