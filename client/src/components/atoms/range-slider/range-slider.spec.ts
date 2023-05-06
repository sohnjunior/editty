import { screen, fireEvent } from '@testing-library/dom'
import { renderToHtml, getTemplateRootElement } from '@/modules/wc-test-utils'

describe('range-slider', () => {
  it('should accept min, max attribute', async () => {
    await renderToHtml(`
      <v-range-slider data-testid="range-slider" min="10" max="50"></v-range-slider>
    `)

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    expect(rootElement.getAttribute('min')).toBe('10')
    expect(rootElement.getAttribute('max')).toBe('50')
  })

  it('should set initial value with value attribute', async () => {
    await renderToHtml(`
      <v-range-slider data-testid="range-slider" min="10" max="50" value="30"></v-range-slider>
    `)

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    expect(rootElement.getAttribute('value')).toBe('30')
  })

  it('should fire input event with current value', async () => {
    await renderToHtml(`
      <v-range-slider data-testid="range-slider" min="10" max="50"></v-range-slider>
    `)

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    /**
     * NOTE: range 타입 input 을 위한 userEvent 가 별도로 없기 때문에 fireEvent 를 활용합니다.
     * @reference
     *  https://github.com/testing-library/user-event/issues/871
     */

    let currentValue = ''
    rangeSliderElement.addEventListener('input', (ev) => {
      currentValue = (ev.target as HTMLInputElement).value
    })

    fireEvent.input(rootElement, { target: { value: 10 } })

    expect(currentValue).toBe('10')
  })
})
