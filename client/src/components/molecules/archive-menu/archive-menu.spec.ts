import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'

import VArchiveMenu from './archive-menu'

describe('archive-menu', () => {
  it('should show menu with open="true"', async () => {
    await renderToHtml(`
      <v-archive-menu data-testid="archive-menu" open="true"></v-color-menu>
    `)

    const $menu = screen.getByTestId('archive-menu')
    expect($menu).toBeVisible()
  })

  it('should lazy load archive property', async () => {
    await renderToHtml(`
      <v-archive-menu data-testid="archive-menu" open="true"></v-color-menu>
    `)

    const $menu = screen.getByTestId<VArchiveMenu>('archive-menu')
    const $root = getTemplateRootElement<HTMLElement>($menu)

    $menu.archives = [{ id: '0', title: 'test', memo: 'test' }]

    const $canvasPreview = $root.querySelector<HTMLDivElement>(
      '.preview-container > v-canvas-preview'
    )

    expect($canvasPreview).toBeInTheDocument()
  })
})
