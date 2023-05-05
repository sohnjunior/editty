import { screen } from '@testing-library/dom'
import { getTemplateRootElement, waitWCStyleInit } from '@/modules/wc-dom'
import Divider from './divider'

describe('divider', () => {
  beforeAll(() => {
    customElements.define(Divider.tag, Divider)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should accept size attribute', async () => {
    document.body.innerHTML = `
      <v-divider data-testid="divider" size="20px"></v-divider>
    `

    await waitWCStyleInit()

    const dividerElement = screen.getByTestId('divider')
    const rootElement = getTemplateRootElement<HTMLHRElement>(dividerElement)

    expect(rootElement.style.height).toBe('20px')
  })

  it('should accept spacing attribute', async () => {
    document.body.innerHTML = `
    <v-divider data-testid="divider" size="20px" spacing="10px"></v-divider>
  `

    await waitWCStyleInit()

    const dividerElement = screen.getByTestId('divider')
    const rootElement = getTemplateRootElement<HTMLHRElement>(dividerElement)

    expect(rootElement.style.margin).toBe('10px 0px')
  })
})
