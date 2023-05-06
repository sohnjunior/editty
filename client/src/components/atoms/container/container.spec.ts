import { getSlotElements } from '@/modules/wc-test-utils'

describe('container', () => {
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
