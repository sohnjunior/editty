import {
  isPointInsideRect,
  get2dMiddlePoint,
  get2dDistance,
  getBoundingRectVertices,
  getRotatedBoundingRectVertices,
  getRotatedPoint,
  getCenterOfBoundingRect,
  getBearingDegree,
  resizeRect,
} from './engine'

describe('Canvas graphic tool', () => {
  describe('isPointInsideRect', () => {
    it('should detect point inside rect', () => {
      const example = {
        pivot: { sx: 100, sy: 100, width: 200, height: 200, degree: 0 },
        pos: { x: 150, y: 150 },
      }

      expect(isPointInsideRect(example)).toBe(true)
    })

    it('should detect point outside rect', () => {
      const example = {
        pivot: { sx: 100, sy: 100, width: 200, height: 200, degree: 0 },
        pos: { x: 310, y: 310 },
      }

      expect(isPointInsideRect(example)).toBe(false)
    })
  })

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

  describe('getBoundingRectVertices', () => {
    it('should get corner coordinates with given needle and width, height info', () => {
      const example = {
        topLeftPoint: { x: 50, y: 50 },
        width: 100,
        height: 100,
      }

      const result = getBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 50, y: 50 },
        ne: { x: 150, y: 50 },
        sw: { x: 50, y: 150 },
        se: { x: 150, y: 150 },
      })
    })
  })
})

describe('Cartesian Coordinate System', () => {
  describe('getRotatedBoundingRectVertices', () => {
    it('should get corner coordinates with rotate-angle: 0', () => {
      const example = {
        vertices: {
          nw: { x: 10, y: 10 },
          ne: { x: 20, y: 10 },
          sw: { x: 10, y: 20 },
          se: { x: 20, y: 20 },
        },
        degree: 0,
      }

      const result = getRotatedBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 10, y: 10 },
        ne: { x: 20, y: 10 },
        sw: { x: 10, y: 20 },
        se: { x: 20, y: 20 },
      })
    })

    it('should get corner coordinates with rotate-angle: 30', () => {
      const example = {
        vertices: {
          nw: { x: 10, y: 10 },
          ne: { x: 20, y: 10 },
          sw: { x: 10, y: 20 },
          se: { x: 20, y: 20 },
        },
        degree: 30,
      }

      const result = getRotatedBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 13, y: 8 },
        ne: { x: 22, y: 13 },
        sw: { x: 8, y: 17 },
        se: { x: 17, y: 22 },
      })
    })

    it('should get corner coordinates with rotate-angle: 210', () => {
      const example = {
        vertices: {
          nw: { x: 10, y: 10 },
          ne: { x: 20, y: 10 },
          sw: { x: 10, y: 20 },
          se: { x: 20, y: 20 },
        },
        degree: 210,
      }

      const result = getRotatedBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 17, y: 22 },
        ne: { x: 8, y: 17 },
        sw: { x: 22, y: 13 },
        se: { x: 13, y: 8 },
      })
    })

    it('should get corner coordinates with rotate-angle: 360', () => {
      const example = {
        vertices: {
          nw: { x: 10, y: 10 },
          ne: { x: 20, y: 10 },
          sw: { x: 10, y: 20 },
          se: { x: 20, y: 20 },
        },
        degree: 360,
      }

      const result = getRotatedBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 10, y: 10 },
        ne: { x: 20, y: 10 },
        sw: { x: 10, y: 20 },
        se: { x: 20, y: 20 },
      })
    })

    it('should get corner coordinates with rotate-angle: 720', () => {
      const example = {
        vertices: {
          nw: { x: 10, y: 10 },
          ne: { x: 20, y: 10 },
          sw: { x: 10, y: 20 },
          se: { x: 20, y: 20 },
        },
        degree: 720,
      }

      const result = getRotatedBoundingRectVertices(example)

      expect(result).toStrictEqual({
        nw: { x: 10, y: 10 },
        ne: { x: 20, y: 10 },
        sw: { x: 10, y: 20 },
        se: { x: 20, y: 20 },
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

      const result = getCenterOfBoundingRect(example)

      expect(result).toStrictEqual({
        x: 2,
        y: 2,
      })
    })
  })

  describe('getRotatedPoint', () => {
    it('should get coordinate with rotated clockwise 90', () => {
      const example = { x: 1, y: 1 }

      const result = getRotatedPoint({ point: example, degree: -90 })

      expect(result).toStrictEqual({
        x: 1,
        y: -1,
      })
    })

    it('should get coordinate with rotated counter-clockwise 90', () => {
      const example = { x: 1, y: 1 }

      const result = getRotatedPoint({ point: example, degree: 90 })

      expect(result).toStrictEqual({
        x: -1,
        y: 1,
      })
    })
  })

  describe('getBearingDegree', () => {
    it('should calculate bearing degree', () => {
      const example = { begin: { x: 5, y: 5 }, end: { x: 7, y: 3 } }

      const result = getBearingDegree(example)

      expect(result).toBe(45)
    })
  })
})
