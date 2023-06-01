import { isTouchEvent } from '@/utils/dom'
import type { ImageObject } from '@molecules/canvas-layer/types'
import type { Point, BoundingRect, BoundingRectVertices } from './types'

/**
 * 캔버스 요소 기준으로 선택된 터치(혹은 클릭) 지점을 px 단위로 반환합니다.
 * @param canvas 대상 캔버스 요소
 * @param ev MouseEvent 혹은 TouchEvent
 */
export function getSyntheticTouchPoint(
  canvas: HTMLCanvasElement,
  ev: MouseEvent | TouchEvent
): Point {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  if (isTouchEvent(ev)) {
    // only deal with one finger touch
    const touch = ev.touches[0]

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    }
  } else {
    return {
      x: (ev.clientX - rect.left) * scaleX,
      y: (ev.clientY - rect.top) * scaleY,
    }
  }
}

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

export function fillBackgroundColor(canvas: HTMLCanvasElement, color: string) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

export function takeSnapshot(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  return context.getImageData(0, 0, canvas.width, canvas.height)
}

export function reflectSnapshot(canvas: HTMLCanvasElement, snapshot: ImageData) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.putImageData(snapshot, 0, 0)
}

/**
 * 캔버스를 초기화합니다.
 * @param canvas 대상 캔버스 요소
 */
export function clearCanvas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
}

/** retina display 에서 더 많은 픽셀로 렌더링합니다. */
export function refineCanvasRatioForRetinaDisplay(canvas: HTMLCanvasElement) {
  const ratio = window.devicePixelRatio
  const { width, height } = getComputedStyle(canvas)

  canvas.width = parseInt(width) * ratio
  canvas.height = parseInt(height) * ratio
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
 * NOTE
 * 다음 함수는 전형적인 데카르트 공간에서만 사용할 수 있어서 canvas 의 좌표 시스템과는 호환이 안된다.
 * 학습차원에서 구현된 것이니 실제 애플리케이션 코드에서는 canvas 에서 제공해주는 rotate 함수를 사용하자.
 *
 * degree 만큼 회전된 사각형 영역의 네 꼭지점 좌표를 반환합니다.
 *
 * @reference
 *  https://math.stackexchange.com/questions/126967/rotating-a-rectangle-via-a-rotation-matrix
 */
export function getRotatedCartesianRectCoordinate({
  vertices,
  degree,
}: {
  vertices: BoundingRectVertices
  degree: number
}) {
  const center = getCenterOfBoundingRect(vertices)
  const shiftedToOrigin = {
    nw: { x: vertices.nw.x - center.x, y: vertices.nw.y - center.y },
    ne: { x: vertices.ne.x - center.x, y: vertices.ne.y - center.y },
    sw: { x: vertices.sw.x - center.x, y: vertices.sw.y - center.y },
    se: { x: vertices.se.x - center.x, y: vertices.se.y - center.y },
  }
  const rotated = {
    nw: getCartesianCoordinate({ point: shiftedToOrigin.nw, degree }),
    ne: getCartesianCoordinate({ point: shiftedToOrigin.ne, degree }),
    sw: getCartesianCoordinate({ point: shiftedToOrigin.sw, degree }),
    se: getCartesianCoordinate({ point: shiftedToOrigin.se, degree }),
  }
  const shiftBack = {
    nw: { x: rotated.nw.x + center.x, y: rotated.nw.y + center.y },
    ne: { x: rotated.ne.x + center.x, y: rotated.ne.y + center.y },
    sw: { x: rotated.sw.x + center.x, y: rotated.sw.y + center.y },
    se: { x: rotated.se.x + center.x, y: rotated.se.y + center.y },
  }

  return shiftBack
}

/**
 * 원점을 기준으로 _degree_ 만큼 화전된 데카르트 좌표계를 반환합니다.
 *
 * @reference
 *  https://en.wikipedia.org/wiki/Rotation_matrix
 */
export function getCartesianCoordinate({ point, degree }: { point: Point; degree: number }) {
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
 * degree > 0 이면 반시계방향, 그 반대이면 시계방향으로 회전된 각입니다.
 * */
function degreeToRadian(degree: number) {
  return (degree * Math.PI) / 180
}

/**
 * 이미지 비율을 유지하되 canvas 너비(portrait) 혹은 높이(landscape)에 맞춰서 크기를 재산정합니다.
 * @param canvas 캔버스 요소 및 최대 적용 비율 (default: 60%)
 * @param original 원본 이미지 너비, 높이
 */
export function refineImageScale(
  canvas: { ref: HTMLCanvasElement; threshold?: number },
  original: { width: number; height: number }
) {
  const isPortrait = canvas.ref.width < canvas.ref.height
  const threshold = canvas.threshold || 0.6
  const criterion = isPortrait ? canvas.ref.width * threshold : canvas.ref.height * threshold
  const aspectRatio = isPortrait
    ? Math.round((original.height / original.width) * 100) / 100
    : Math.round((original.width / original.height) * 100) / 100

  const expected = isPortrait
    ? { width: criterion, height: Math.floor(criterion * aspectRatio) }
    : { width: Math.floor(criterion * aspectRatio), height: criterion }

  if (original.width < expected.width && original.height < expected.height) {
    return original
  }

  return expected
}

/**
 * ImageObject 를 생성합니다.
 * @param dataUrl base64 인코딩된 dataUrl 이미지
 * @param topLeftPoint image top-left 좌표값
 */
export async function createImageObject({
  dataUrl,
  topLeftPoint,
}: {
  dataUrl: string
  topLeftPoint: Point
}): Promise<ImageObject> {
  return new Promise((resolve, reject) => {
    const $image = new Image()
    $image.src = dataUrl

    $image.onload = () => {
      resolve({
        dataUrl,
        sx: topLeftPoint.x,
        sy: topLeftPoint.y,
        width: $image.width,
        height: $image.height,
        ref: $image,
      })
    }

    $image.onerror = () => {
      reject()
    }
  })
}

/** 사각형 꼭지점을 기준으로 사이즈 조절된 결과를 반환합니다. */
export function resizeRect({
  type,
  originalBoundingRect,
  vectorTerminalPoint,
}: {
  type: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
  originalBoundingRect: BoundingRect
  vectorTerminalPoint: Point
}) {
  switch (type) {
    case 'TOP_LEFT':
      return resizeTL(originalBoundingRect, vectorTerminalPoint)
    case 'TOP_RIGHT':
      return resizeTR(originalBoundingRect, vectorTerminalPoint)
    case 'BOTTOM_LEFT':
      return resizeBL(originalBoundingRect, vectorTerminalPoint)
    case 'BOTTOM_RIGHT':
      return resizeBR(originalBoundingRect, vectorTerminalPoint)
  }
}

function resizeTL(originalBoundingRect: BoundingRect, vectorTerminalPoint: Point): BoundingRect {
  const { sx, sy, width: oWidth, height: oHeight } = originalBoundingRect
  const vectorInitialPoint: Point = { x: sx + oWidth, y: sy + oHeight }

  const width = Math.abs(vectorTerminalPoint.x - vectorInitialPoint.x)
  const height = Math.abs(vectorTerminalPoint.y - vectorInitialPoint.y)

  return {
    sx: vectorTerminalPoint.x,
    sy: vectorTerminalPoint.y,
    width,
    height,
  }
}

function resizeTR(originalBoundingRect: BoundingRect, vectorTerminalPoint: Point): BoundingRect {
  const { sx, sy, height: oHeight } = originalBoundingRect
  const vectorInitialPoint: Point = { x: sx, y: sy + oHeight }

  const width = Math.abs(vectorTerminalPoint.x - vectorInitialPoint.x)
  const height = Math.abs(vectorTerminalPoint.y - vectorInitialPoint.y)

  return {
    sx,
    sy: vectorTerminalPoint.y,
    width,
    height,
  }
}

function resizeBL(originalBoundingRect: BoundingRect, vectorTerminalPoint: Point): BoundingRect {
  const { sx, sy, width: oWidth } = originalBoundingRect
  const vectorInitialPoint: Point = { x: sx + oWidth, y: sy }

  const width = Math.abs(vectorTerminalPoint.x - vectorInitialPoint.x)
  const height = Math.abs(vectorTerminalPoint.y - vectorInitialPoint.y)

  return {
    sx: vectorTerminalPoint.x,
    sy: vectorInitialPoint.y,
    width,
    height,
  }
}

function resizeBR(originalBoundingRect: BoundingRect, vectorTerminalPoint: Point): BoundingRect {
  const { sx, sy } = originalBoundingRect
  const vectorInitialPoint: Point = { x: sx, y: sy }

  const width = Math.abs(vectorTerminalPoint.x - vectorInitialPoint.x)
  const height = Math.abs(vectorTerminalPoint.y - vectorInitialPoint.y)

  return {
    sx: vectorInitialPoint.x,
    sy: vectorInitialPoint.y,
    width,
    height,
  }
}

export function drawCircle({
  context,
  centerPoint,
  radius,
}: {
  context: CanvasRenderingContext2D
  centerPoint: Point
  radius: number
}) {
  const path = new Path2D()
  path.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2)
  context.fillStyle = 'rgba(151, 222, 255)'
  context.fill(path)

  return path
}

export function drawLine({
  context,
  from,
  to,
  color = 'rgba(151, 222, 255)',
  lineWidth = 5,
}: {
  context: CanvasRenderingContext2D
  from: Point
  to: Point
  color?: string
  lineWidth?: number
}) {
  const path = new Path2D()
  path.moveTo(from.x, from.y)
  path.lineTo(to.x, to.y)

  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.stroke(path)

  return path
}

// TODO: corners 대신 vertices 로 변경
export function drawRect({
  context,
  corners,
}: {
  context: CanvasRenderingContext2D
  corners: Point[]
}) {
  drawLine({
    context,
    from: { x: corners[0].x, y: corners[0].y },
    to: { x: corners[1].x, y: corners[1].y },
  })
  drawLine({
    context,
    from: { x: corners[1].x, y: corners[1].y },
    to: { x: corners[2].x, y: corners[2].y },
  })
  drawLine({
    context,
    from: { x: corners[2].x, y: corners[2].y },
    to: { x: corners[3].x, y: corners[3].y },
  })
  drawLine({
    context,
    from: { x: corners[3].x, y: corners[3].y },
    to: { x: corners[0].x, y: corners[0].y },
  })
}
