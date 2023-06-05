import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'
import VDialog from '@atoms/dialog/dialog'
import VConfirmDialog from './confirm-dialog'

describe('confirm-dialog', () => {
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

  it('should bubble dialog:confirm event', async () => {
    await renderToHtml(`
      <v-confirm-dialog data-testid="confirm-dialog" open="false"></v-confirm-dialog>
    `)

    const $dialog = screen.getByTestId<VConfirmDialog>('confirm-dialog')
    const $root = getTemplateRootElement<VDialog>($dialog)

    const mockListener = jest.fn(() => {})

    $dialog.open = 'true'
    $dialog.addEventListener('dialog:confirm', mockListener)

    const $confirmButton = $root.querySelector('#confirm-button')!

    const user = userEvent.setup()
    await user.click($confirmButton)

    expect(mockListener).toBeCalled()
    expect($dialog.open).toBe('false')
  })

  it('should bubble dialog:cancel event', async () => {
    await renderToHtml(`
      <v-confirm-dialog data-testid="confirm-dialog" open="false"></v-confirm-dialog>
    `)

    const $dialog = screen.getByTestId<VConfirmDialog>('confirm-dialog')
    const $root = getTemplateRootElement<VDialog>($dialog)

    const mockListener = jest.fn(() => {})

    $dialog.open = 'true'
    $dialog.addEventListener('dialog:cancel', mockListener)

    const $cancelButton = $root.querySelector('#cancel-button')!

    const user = userEvent.setup()
    await user.click($cancelButton)

    expect(mockListener).toBeCalled()
    expect($dialog.open).toBe('false')
  })
})
