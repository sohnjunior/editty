import TextInput from './text-input'

describe('text-input', () => {
  it('should accept placeholder attribute', async () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-text-input placeholder="test" />
    `

    const target = example.querySelector('v-text-input')
    const input = target?.shadowRoot?.querySelector('input')

    expect(input?.placeholder).toBe('test')
  })

  it('should offer up-to-date value attribute with change event', async () => {
    const example = document.createElement('div')
    example.innerHTML = `
      <v-text-input placeholder="test" />
    `

    const target = example.querySelector('v-text-input')
    const input = target?.shadowRoot?.querySelector('input')
    const host = target?.shadowRoot?.host as TextInput

    if (input) {
      input.value = 'test'
      expect(host.value).toBe('test')
    }
  })
})
