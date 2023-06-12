import { resizeRect } from './graphic'

describe('resizeRect', () => {
  it('should resize rect from bottom-right', () => {
    const example = {
      type: 'BOTTOM_RIGHT',
      originalBoundingRect: { sx: 200, sy: 200, width: 400, height: 400, degree: 0 },
      vectorTerminalPoint: { x: 700, y: 700 },
    } as const

    expect(resizeRect(example)).toStrictEqual({
      sx: 200,
      sy: 200,
      width: 500,
      height: 500,
      degree: 0,
    })
  })
})
