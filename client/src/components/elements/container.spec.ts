import Container from './container'

function getSlotElements(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedElements() ?? []
}

describe('container', () => {
  beforeAll(() => {
    customElements.define(Container.tag, Container)
  })

  it('should render slot', async () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-container data-id="v-container">
        <div>test</div>
      </v-container>
    `

    const target = example.querySelector('[data-id="v-container"]')
    const slotElement = getSlotElements(target)[0]
    expect(slotElement).toHaveTextContent('test')
  })
})
