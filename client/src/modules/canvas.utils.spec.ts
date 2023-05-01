import { isPointInsideRect, get2dMiddlePoint, get2dDistance, resizeRect } from './canvas.utils'

describe('geometry tool', () => {
  it('get2dMiddlePoint', () => {
    const pointA = { x: 0, y: 0 }
    const pointB = { x: 2, y: 0 }

    expect(get2dMiddlePoint(pointA, pointB)).toStrictEqual({ x: 1, y: 0 })
  })

  it('get2dDistance', () => {
    const pointA = { x: 0, y: 0 }
    const pointB = { x: 2, y: 0 }

    expect(get2dDistance(pointA, pointB)).toBe(2)
  })
})

describe('2d graphic tool', () => {
  describe('isPointInsideRect', () => {
    it('should detect point inside rect', () => {
      const example = {
        pivot: { sx: 100, sy: 100, width: 200, height: 200 },
        pos: { x: 150, y: 150 },
      }

      expect(isPointInsideRect(example)).toBe(true)
    })

    it('should detect point outside rect', () => {
      const example = {
        pivot: { sx: 100, sy: 100, width: 200, height: 200 },
        pos: { x: 310, y: 310 },
      }

      expect(isPointInsideRect(example)).toBe(false)
    })
  })

  describe('resizeRect', () => {
    it('should resize rect from top-left', () => {
      const example = {
        type: 'TOP_LEFT',
        originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
        vectorTerminalPoint: { x: 100, y: 100 },
      } as const

      expect(resizeRect(example)).toStrictEqual({ sx: 100, sy: 100, width: 500, height: 500 })
    })

    it('should resize rect from top-right', () => {
      const example = {
        type: 'TOP_RIGHT',
        originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
        vectorTerminalPoint: { x: 700, y: 100 },
      } as const

      expect(resizeRect(example)).toStrictEqual({ sx: 200, sy: 100, width: 500, height: 500 })
    })

    it('should resize rect from bottom-right', () => {
      const example = {
        type: 'BOTTOM_RIGHT',
        originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
        vectorTerminalPoint: { x: 700, y: 700 },
      } as const

      expect(resizeRect(example)).toStrictEqual({ sx: 200, sy: 200, width: 500, height: 500 })
    })

    it('should resize rect from bottom-left', () => {
      const example = {
        type: 'BOTTOM_LEFT',
        originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
        vectorTerminalPoint: { x: 100, y: 700 },
      } as const

      expect(resizeRect(example)).toStrictEqual({ sx: 100, sy: 200, width: 500, height: 500 })
    })
  })
})
