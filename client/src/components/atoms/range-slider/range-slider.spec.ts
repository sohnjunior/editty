import RangeSlider from './range-slider'
import { screen, fireEvent } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { getTemplateRootElement, waitWCStyleInit, getInitialStyle } from '@/modules/wc-dom'

describe('range-slider', () => {
  beforeAll(() => {
    customElements.define(RangeSlider.tag, RangeSlider)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should accept min, max attribute', () => {
    document.body.innerHTML = `
      <v-range-slider data-testid="range-slider" min="10" max="50"></v-range-slider>
    `

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    expect(rootElement.getAttribute('min')).toBe('10')
    expect(rootElement.getAttribute('max')).toBe('50')
  })

  it('should set initial value with value attribute', () => {
    document.body.innerHTML = `
    <v-range-slider data-testid="range-slider" min="10" max="50" value="30"></v-range-slider>
  `

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    expect(rootElement.getAttribute('value')).toBe('30')
  })

  it('should fire input event with current value', async () => {
    document.body.innerHTML = `
      <v-range-slider data-testid="range-slider" min="10" max="50"></v-range-slider>
    `
    await waitWCStyleInit()

    const rangeSliderElement = screen.getByTestId('range-slider')
    const rootElement = getTemplateRootElement<HTMLInputElement>(rangeSliderElement)

    let currentValue = ''
    rangeSliderElement.addEventListener('input', (ev) => {
      currentValue = (ev.target as HTMLInputElement).value
    })

    fireEvent.input(rootElement, { target: { value: 10 } })

    expect(currentValue).toBe('10')
  })
})
