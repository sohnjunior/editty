import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'
import VTextarea from './textarea'

describe('textarea', () => {
  it('should accept placeholder attribute', async () => {
    await renderToHtml(`
      <v-textarea data-testid="textarea" placeholder="test" />
    `)

    const $textarea = screen.getByTestId('textarea')
    const $root = getTemplateRootElement<HTMLInputElement>($textarea)

    expect($root.placeholder).toBe('test')
  })

  it('should get up-to-date value with input event', async () => {
    await renderToHtml(`
      <v-textarea data-testid="textarea" placeholder="test" />
    `)

    const $textarea = screen.getByTestId<VTextarea>('textarea')
    const $root = getTemplateRootElement<HTMLInputElement>($textarea)

    $textarea.value = 'test'

    expect($root.value).toBe('test')
  })
})
