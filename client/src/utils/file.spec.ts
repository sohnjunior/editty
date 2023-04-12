import { readAsDataURL } from './file'

describe('readAsDataURL (function)', () => {
  it('should read file as dataUrl format', async () => {
    const example = new File([''], 'example.png', { type: 'image/png' })
    const result = await readAsDataURL(example)
    expect(result).toMatch(/^data:image\/png;base64/)
  })
})
