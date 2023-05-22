import { screen, waitFor } from '@testing-library/dom'
import { renderToHtml } from '@/modules/wc-test-utils'
import VToast from './toast'

describe('toast', () => {
  it('should autoclose after 2s', async () => {
    await renderToHtml(`
      <v-toast data-testid="toast" variant="success" open="true" autoclose="true">
        <span slot="title">title</span>
        <span slot="description">description</span>
      </v-toast>
    `)

    const toast = screen.getByTestId('toast') as VToast
    await waitFor(
      () => {
        expect(toast.open).toBe(false)
      },
      { timeout: 3000 }
    )
  })
})
