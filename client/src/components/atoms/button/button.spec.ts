import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement, getInitialStyle } from '@/modules/wc-test-utils'

describe('button', () => {
  it('should render slot', async () => {
    await renderToHtml(`
      <v-button data-testid="button" color="red">test</v-button>
    `)

    const buttonElement = screen.getByTestId('button')

    expect(buttonElement).toHaveTextContent('test')
  })
})
