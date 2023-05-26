import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'
import VTextInput from './text-input'

describe('text-input', () => {
  it('should accept placeholder attribute', async () => {
    await renderToHtml(`
      <v-text-input data-testid="text-input" placeholder="test" />
    `)

    const textInputElement = screen.getByTestId('text-input')
    const rootElement = getTemplateRootElement<HTMLInputElement>(textInputElement)

    expect(rootElement.placeholder).toBe('test')
  })

  it('should get up-to-date value with input event', async () => {
    await renderToHtml(`
      <v-text-input data-testid="text-input" placeholder="test" />
    `)

    const textInputElement = screen.getByTestId<VTextInput>('text-input')
    const rootElement = getTemplateRootElement<HTMLInputElement>(textInputElement)

    textInputElement.value = 'test'

    expect(rootElement.value).toBe('test')
  })
})
