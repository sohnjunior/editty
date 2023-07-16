import { screen } from '@testing-library/dom'
import { renderToHtml } from '@/modules/wc-test-utils'

describe('memo-menu', () => {
  it('should show menu with open="true"', async () => {
    await renderToHtml(`
      <v-memo-menu data-testid="memo-menu" open="true"></v-memo-menu>
    `)

    const $menu = screen.getByTestId('memo-menu')
    expect($menu).toBeVisible()
  })
})
