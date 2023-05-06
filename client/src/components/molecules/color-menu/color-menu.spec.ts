import { screen } from '@testing-library/dom'
import { renderToHtml, waitWCStyleInit } from '@/modules/wc-test-utils'

describe('color-menu', () => {
  it('should show menu with open="true"', async () => {
    await renderToHtml(`
      <v-color-menu data-testid="color-menu" open="true"></v-color-menu>
    `)

    await waitWCStyleInit()

    const menuElement = screen.getByTestId('color-menu')
    expect(menuElement).toBeVisible()
  })
})
