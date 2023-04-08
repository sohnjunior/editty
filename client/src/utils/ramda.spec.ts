import { lastOf } from './ramda'

describe('ramda functions', () => {
  describe('lastOf', () => {
    it('should slice last element of array', () => {
      expect(lastOf([1, 2, 3, 4, 5])).toBe(5)
    })

    it('should return undefined for empty array', () => {
      expect(lastOf([])).toBe(undefined)
    })
  })
})
