import Container from './container'
import { getSlotElements } from '@/utils/dom'

describe('container', () => {
  beforeAll(() => {
    customElements.define(Container.tag, Container)
  })

  it('should render slot', async () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-container>
        <div>test</div>
      </v-container>
    `

    const target = example.querySelector('v-container')
    const slotElement = getSlotElements(target)[0]
    expect(slotElement).toHaveTextContent('test')
  })
})
