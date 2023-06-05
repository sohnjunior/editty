import { screen, waitFor } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement, getInitialStyle } from '@/modules/wc-test-utils'
import VDialog from './dialog'

describe('dialog', () => {
  beforeAll(() => {
    /**
     * 💡 Use mocked method until jsdom support HTMLDialogElement
     * @reference
     *  https://github.com/jsdom/jsdom/issues/3294#issuecomment-1196577616
     */
    HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
      this.open = false
    })
    HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
      this.open = false
    })
  })

  it('should render dialog with open="true"', async () => {
    await renderToHtml(`
      <v-dialog data-testid="dialog" open="false">
        <div slot="title">다이얼로그</div>
      </v-dialog>
    `)

    const $dialog = screen.getByTestId<VDialog>('dialog')
    const $root = getTemplateRootElement<HTMLDialogElement>($dialog)

    expect($root).not.toBeVisible()

    $dialog.open = 'true'

    waitFor(() => expect($root).toBeVisible())
  })
})
