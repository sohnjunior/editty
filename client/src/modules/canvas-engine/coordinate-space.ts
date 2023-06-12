import type { Point, Vector, BoundingRect, BoundingRectVertices } from './types'

/** 2차원 평면좌표에서 두점 사이의 중간 지점을 반환합니다. */
export function get2dMiddlePoint(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

/** 2차원 평면좌표에서 두점 사이의 거리를 반환합니다. */
export function get2dDistance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

/**
 * (sx, sy) 를 좌측 최상단으로 하는 width 너비, height 높이를 가지는 정사각형 영역에 (x, y) 가 포함되는지 판단합니다.
 */
export function isPointInsideRect({ pivot, pos }: { pivot: BoundingRect; pos: Point }) {
  const { sx, sy, width, height } = pivot
  const [ex, ey] = [sx + width, sy + height]

  // escape if (sx, sy) is not top-left position
  if (sx >= ex || sy >= ey) {
    return false
  }

  if (sx <= pos.x && pos.x <= ex && sy <= pos.y && pos.y <= ey) {
    return true
  }

  return false
}

/** top-left 좌표지점과 주어진 너비 & 높이를 기준으로 회전되지 않은 사각형의 꼭짓점좌표를 반환합니다. */
export function getBoundingRectVertices({
  topLeftPoint,
  width,
  height,
}: {
  topLeftPoint: Point
  width: number
  height: number
}) {
  const { x: sx, y: sy } = topLeftPoint
  const vertices: BoundingRectVertices = {
    nw: { x: sx, y: sy },
    ne: { x: sx + width, y: sy },
    sw: { x: sx, y: sy + height },
    se: { x: sx + width, y: sy + height },
  }

  return vertices
}

/**
 * degree 만큼 회전된 사각형 영역의 네 꼭지점 좌표를 반환합니다.
 *
 * @reference
 *  https://math.stackexchange.com/questions/126967/rotating-a-rectangle-via-a-rotation-matrix
 */
export function getRotatedBoundingRectVertices({
  vertices,
  degree,
}: {
  vertices: BoundingRectVertices
  degree: number
}): BoundingRectVertices {
  const center = getCenterOfBoundingRect(vertices)
  const shiftedToOrigin: BoundingRectVertices = {
    nw: { x: vertices.nw.x - center.x, y: vertices.nw.y - center.y },
    ne: { x: vertices.ne.x - center.x, y: vertices.ne.y - center.y },
    sw: { x: vertices.sw.x - center.x, y: vertices.sw.y - center.y },
    se: { x: vertices.se.x - center.x, y: vertices.se.y - center.y },
  }
  const rotated: BoundingRectVertices = {
    nw: getRotatedPoint({ point: shiftedToOrigin.nw, degree }),
    ne: getRotatedPoint({ point: shiftedToOrigin.ne, degree }),
    sw: getRotatedPoint({ point: shiftedToOrigin.sw, degree }),
    se: getRotatedPoint({ point: shiftedToOrigin.se, degree }),
  }
  const shiftBack: BoundingRectVertices = {
    nw: { x: rotated.nw.x + center.x, y: rotated.nw.y + center.y },
    ne: { x: rotated.ne.x + center.x, y: rotated.ne.y + center.y },
    sw: { x: rotated.sw.x + center.x, y: rotated.sw.y + center.y },
    se: { x: rotated.se.x + center.x, y: rotated.se.y + center.y },
  }

  return shiftBack
}

/**
 * 원점을 기준으로 _degree_ 만큼 화전된 좌표를 반환합니다.
 *
 * @reference
 *  https://en.wikipedia.org/wiki/Rotation_matrix
 */
export function getRotatedPoint({ point, degree }: { point: Point; degree: number }) {
  const { x, y } = point
  const radian = degreeToRadian(degree)
  const vector = {
    x: Math.round(x * Math.cos(radian) - y * Math.sin(radian)),
    y: Math.round(x * Math.sin(radian) + y * Math.cos(radian)),
  }

  return vector
}

/**
 * 사각형의 중점을 반환합니다.
 */
export function getCenterOfBoundingRect({ nw, ne, se }: BoundingRectVertices) {
  const x = Math.round((nw.x + ne.x) / 2)
  const y = Math.round((nw.y + se.y) / 2)

  return { x, y }
}

/**
 * degree 를 radian 으로 변환합니다.
 * degree > 0 이면 시계방향, 그 반대이면 반시계방향으로 회전된 각입니다.
 * */
export function degreeToRadian(degree: number) {
  return (degree * Math.PI) / 180
}

function radianToDegree(radian: number) {
  return (radian * 180) / Math.PI
}

/**
 * _vector_ 와 _vector.begin_ 에 수직인 벡터 사이의 각(방위각)을 구합니다.
 */
export function getBearingDegree(vector: Vector) {
  const thetaA = Math.atan2(vector.end.x - vector.begin.x, -vector.end.y + vector.begin.y)
  const theta = thetaA >= 0 ? thetaA : Math.PI * 2 + thetaA

  return Math.floor(radianToDegree(theta))
}
