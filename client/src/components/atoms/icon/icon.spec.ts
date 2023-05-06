import { screen } from '@testing-library/dom'
import { getTemplateRootElement, waitWCStyleInit } from '@/modules/wc-dom'

describe('icon', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render icon with medium size', async () => {
    document.body.innerHTML = `
      <v-icon data-testid="icon" icon="emoji" size="medium"></v-icon>
    `

    await waitWCStyleInit()

    const iconElement = screen.getByTestId('icon')
    const rootElement = getTemplateRootElement<HTMLDivElement>(iconElement)

    expect(iconElement.style.backgroundImage).toBeDefined()
    expect(rootElement.style.width).toBe('15px')
    expect(rootElement.style.height).toBe('15px')
  })
})
