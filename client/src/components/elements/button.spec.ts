import Button from './button'

function getSlotNodes(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedNodes() ?? []
}

describe('button', () => {
  beforeAll(() => {
    customElements.define(Button.tag, Button)
  })

  it('should render slot', () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-button color="red">test</v-button>
    `
    const target = example.querySelector('v-button')
    const slotElement = getSlotNodes(target)[0]
    expect(slotElement).toHaveTextContent('test')
  })

  it('should accept color attribute', () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-button color="red">test</v-button>
    `

    const target = example.querySelector('v-button')
    const button = target?.shadowRoot?.querySelector('button')

    expect(button?.style.color).toBe('red')
  })
})
