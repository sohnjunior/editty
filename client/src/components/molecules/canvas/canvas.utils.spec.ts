import { getMiddlePoint, getDistance2dPoint, resizeRect } from './canvas.utils'

describe('geometry', () => {
  it('getMiddlePoint', () => {
    const pointA = { x: 0, y: 0 }
    const pointB = { x: 2, y: 0 }

    expect(getMiddlePoint(pointA, pointB)).toStrictEqual({ x: 1, y: 0 })
  })

  it('getDistance2dPoint', () => {
    const pointA = { x: 0, y: 0 }
    const pointB = { x: 2, y: 0 }

    expect(getDistance2dPoint(pointA, pointB)).toBe(2)
  })
})

describe('2d graphic tool', () => {
  it('resizeRect (top-left)', () => {
    const example = {
      type: 'TOP_LEFT',
      originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
      vectorTerminalPoint: { x: 100, y: 100 },
    } as const

    expect(resizeRect(example)).toStrictEqual({ sx: 100, sy: 100, width: 500, height: 500 })
  })

  it('resizeRect (top-right)', () => {
    const example = {
      type: 'TOP_RIGHT',
      originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
      vectorTerminalPoint: { x: 700, y: 100 },
    } as const

    expect(resizeRect(example)).toStrictEqual({ sx: 200, sy: 100, width: 500, height: 500 })
  })

  it('resizeRect (bottom-right)', () => {
    const example = {
      type: 'BOTTOM_RIGHT',
      originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
      vectorTerminalPoint: { x: 700, y: 700 },
    } as const

    expect(resizeRect(example)).toStrictEqual({ sx: 200, sy: 200, width: 500, height: 500 })
  })

  it('resizeRect (bottom-left)', () => {
    const example = {
      type: 'BOTTOM_LEFT',
      originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400 },
      vectorTerminalPoint: { x: 100, y: 700 },
    } as const

    expect(resizeRect(example)).toStrictEqual({ sx: 100, sy: 200, width: 500, height: 500 })
  })
})
