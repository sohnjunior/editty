import StrokeMenu from './stroke-menu'
import { screen } from '@testing-library/dom'
import { waitWCStyleInit } from '@/modules/wc-dom'

describe('stroke-menu', () => {
  beforeAll(() => {
    customElements.define(StrokeMenu.tag, StrokeMenu)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should show menu with open="true"', async () => {
    document.body.innerHTML = `
      <v-stroke-menu data-testid="stroke-menu" open="true"></v-stroke-menu>
    `

    await waitWCStyleInit()

    const menuElement = screen.getByTestId('stroke-menu')
    expect(menuElement).toBeVisible()
  })

  it('should change stroke with attribute', async () => {
    document.body.innerHTML = `
      <v-stroke-menu data-testid="stroke-menu" open="true" stroke="draw"></v-stroke-menu>
    `

    await waitWCStyleInit()

    const menuElement = screen.getByTestId('stroke-menu')
    menuElement.setAttribute('stroke', 'erase')

    expect(menuElement.getAttribute('stroke')).toBe('erase')
  })
})
