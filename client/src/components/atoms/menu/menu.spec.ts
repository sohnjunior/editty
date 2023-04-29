import Menu from './menu'
import Container from '../container/container'
import { screen } from '@testing-library/dom'
import { getTemplateRootElement, waitWCStyleInit, getInitialStyle } from '@/modules/wc-dom'

describe('menu', () => {
  beforeAll(() => {
    customElements.define(Menu.tag, Menu)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should show menu with open="true"', async () => {
    document.body.innerHTML = `
      <v-menu data-testid="menu" open="true">
        <div slot="content">test menu</div>
      </v-menu>
    `

    await waitWCStyleInit()

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)

    expect(rootElement).toBeVisible()
  })

  it('should hide menu with open="false"', async () => {
    document.body.innerHTML = `
      <v-menu data-testid="menu" open="false">
        <div slot="content">test menu</div>
      </v-menu>
    `

    await waitWCStyleInit()

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)

    expect(rootElement).not.toBeVisible()
  })

  it('should accept maxWidth attribute', async () => {
    document.body.innerHTML = `
      <v-menu data-testid="menu" open="true" width="300px">
        <div>test menu</div>
      </v-menu>
    `

    const menuElement = screen.getByTestId('menu')
    const rootElement = getTemplateRootElement<Container>(menuElement)
    const style = await getInitialStyle(rootElement)

    expect(style.maxWidth).toBe('300px')
  })
})
