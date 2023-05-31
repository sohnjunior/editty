import {
  isPointInsideRect,
  get2dMiddlePoint,
  get2dDistance,
  getRotatedCartesianRectCoordinate,
  getCartesianCoordinate,
  getCenterOfCartesianRect,
  resizeRect,
} from './engine'

describe('Canvas graphic tool', () => {
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

describe('Cartesian Coordinate System', () => {
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

  describe('getRotatedCartesianRectCoordinate', () => {
    it('should get corner coordinates with rotate-angle: 0', () => {
      const example = {
        vertices: {
          nw: { x: 50, y: 50 },
          ne: { x: 150, y: 50 },
          sw: { x: 50, y: 0 },
          se: { x: 150, y: 0 },
        },
        degree: 0,
      }

      const result = getRotatedCartesianRectCoordinate(example)

      expect(result).toStrictEqual({
        nw: { x: 50, y: 50 },
        ne: { x: 150, y: 50 },
        sw: { x: 50, y: 0 },
        se: { x: 150, y: 0 },
      })
    })

    it('should get corner coordinates with rotate-angle: 30', () => {
      const example = {
        vertices: {
          nw: { x: 50, y: 50 },
          ne: { x: 150, y: 50 },
          sw: { x: 50, y: 0 },
          se: { x: 150, y: 0 },
        },
        degree: 30,
      }

      const result = getRotatedCartesianRectCoordinate(example)

      expect(result).toStrictEqual({
        nw: { x: 44, y: 22 },
        ne: { x: 131, y: 72 },
        sw: { x: 69, y: -22 },
        se: { x: 156, y: 28 },
      })
    })

    it('should get corner coordinates with rotate-angle: 210', () => {
      const example = {
        vertices: {
          nw: { x: 50, y: 50 },
          ne: { x: 150, y: 50 },
          sw: { x: 50, y: 0 },
          se: { x: 150, y: 0 },
        },
        degree: 210,
      }

      const result = getRotatedCartesianRectCoordinate(example)

      expect(result).toStrictEqual({
        nw: { x: 156, y: 28 },
        ne: { x: 69, y: -22 },
        sw: { x: 131, y: 72 },
        se: { x: 44, y: 22 },
      })
    })

    it('should get corner coordinates with rotate-angle: 360', () => {
      const example = {
        vertices: {
          nw: { x: 50, y: 50 },
          ne: { x: 150, y: 50 },
          sw: { x: 50, y: 0 },
          se: { x: 150, y: 0 },
        },
        degree: 360,
      }

      const result = getRotatedCartesianRectCoordinate(example)

      expect(result).toStrictEqual({
        nw: { x: 50, y: 50 },
        ne: { x: 150, y: 50 },
        sw: { x: 50, y: 0 },
        se: { x: 150, y: 0 },
      })
    })

    it('should get corner coordinates with rotate-angle: 720', () => {
      const example = {
        vertices: {
          nw: { x: 50, y: 50 },
          ne: { x: 150, y: 50 },
          sw: { x: 50, y: 0 },
          se: { x: 150, y: 0 },
        },
        degree: 720,
      }

      const result = getRotatedCartesianRectCoordinate(example)

      expect(result).toStrictEqual({
        nw: { x: 50, y: 50 },
        ne: { x: 150, y: 50 },
        sw: { x: 50, y: 0 },
        se: { x: 150, y: 0 },
      })
    })
  })

  describe('getCenterOfCartesianRect', () => {
    it('should get center coordinate of rectangle', () => {
      const example = {
        nw: { x: 1, y: 3 },
        ne: { x: 3, y: 3 },
        sw: { x: 1, y: 1 },
        se: { x: 3, y: 1 },
      }

      const result = getCenterOfCartesianRect(example)

      expect(result).toStrictEqual({
        x: 2,
        y: 2,
      })
    })
  })

  describe('getCartesianCoordinate', () => {
    it('should get coordinate with rotated clockwise 90', () => {
      const example = { x: 1, y: 1 }

      const result = getCartesianCoordinate({ point: example, degree: -90 })

      expect(result).toStrictEqual({
        x: 1,
        y: -1,
      })
    })

    it('should get coordinate with rotated counter-clockwise 90', () => {
      const example = { x: 1, y: 1 }

      const result = getCartesianCoordinate({ point: example, degree: 90 })

      expect(result).toStrictEqual({
        x: -1,
        y: 1,
      })
    })
  })
})
