import Container from '../container/container'
import { screen } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement, getInitialStyle } from '@/modules/wc-test-utils'

describe('menu', () => {
  it('should show menu with open="true"', async () => {
    await renderToHtml(`
      <v-menu data-testid="menu" open="true">
        <div slot="content">test menu</div>
      </v-menu>
    `)

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)

    expect(rootElement).toBeVisible()
  })

  it('should hide menu with open="false"', async () => {
    await renderToHtml(`
      <v-menu data-testid="menu" open="false">
        <div slot="content">test menu</div>
      </v-menu>
    `)

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)

    expect(rootElement).not.toBeVisible()
  })

  it('should accept maxWidth attribute', async () => {
    await renderToHtml(`
      <v-menu data-testid="menu" open="true" width="300px">
        <div>test menu</div>
      </v-menu>
    `)

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)
    const style = await getInitialStyle(rootElement)

    expect(style.minWidth).toBe('300px')
  })
})
