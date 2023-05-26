import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'

describe('canvas-preview', () => {
  it('should accept caption attribute', async () => {
    await renderToHtml(`
      <v-canvas-preview data-testid="canvas-preview" caption="테스트"></v-canvas-preview>
    `)

    const $canvasPreview = screen.getByTestId('canvas-preview')
    const $root = getTemplateRootElement<HTMLElement>($canvasPreview)

    expect($root).toHaveTextContent('테스트')
  })
})
