import { screen } from '@testing-library/dom'
import { renderToHtml } from '@/modules/wc-test-utils'

describe('stroke-menu', () => {
  it('should show menu with open="true"', async () => {
    await renderToHtml(`
      <v-stroke-menu data-testid="stroke-menu" open="true"></v-stroke-menu>
    `)

    const menuElement = screen.getByTestId('stroke-menu')
    expect(menuElement).toBeVisible()
  })

  it('should change stroke with attribute', async () => {
    await renderToHtml(`
      <v-stroke-menu data-testid="stroke-menu" open="true" stroke="draw"></v-stroke-menu>
    `)

    const menuElement = screen.getByTestId('stroke-menu')
    menuElement.setAttribute('stroke', 'erase')

    expect(menuElement.getAttribute('stroke')).toBe('erase')
  })
})
