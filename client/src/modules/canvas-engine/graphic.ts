import { getBoundingRectVertices, get2dDistance } from './coordinate-space'
import type { Point, BoundingRect, BoundingRectVertices } from './types'

export function fillCanvasBackgroundColor(canvas: HTMLCanvasElement, color: string) {
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

/** 사각형 꼭지점을 기준으로 사이즈 조절된 결과를 반환합니다. */
export function resizeRect({
  type,
  originalBoundingRect,
  vectorTerminalPoint,
}: {
  type: 'BOTTOM_RIGHT'
  originalBoundingRect: BoundingRect
  vectorTerminalPoint: Point
}) {
  switch (type) {
    case 'BOTTOM_RIGHT':
      return resizeBR(originalBoundingRect, vectorTerminalPoint)
  }
}

function resizeBR(originalBoundingRect: BoundingRect, vectorTerminalPoint: Point): BoundingRect {
  const { sx, sy, width, height, degree } = originalBoundingRect
  const vectorInitialPoint: Point = { x: sx, y: sy }
  const vertices = getBoundingRectVertices({ topLeftPoint: vectorInitialPoint, width, height })

  const ov = get2dDistance(vertices.nw, vertices.se)
  const v = get2dDistance(vectorInitialPoint, vectorTerminalPoint)
  const ratio = v / ov

  const resizedWidth = Math.abs(width * ratio)
  const resizedHeight = Math.abs(height * ratio)

  return {
    sx: vectorInitialPoint.x,
    sy: vectorInitialPoint.y,
    width: resizedWidth,
    height: resizedHeight,
    degree,
  }
}

export function drawCircle({
  context,
  centerPoint,
  radius,
  color = 'rgba(151, 222, 255)',
}: {
  context: CanvasRenderingContext2D
  centerPoint: Point
  radius: number
  color?: string
}) {
  const path = new Path2D()
  path.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2)
  context.fillStyle = color
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

export function drawRect({
  context,
  vertices: { nw, ne, sw, se },
  color = 'rgba(151, 222, 255)',
}: {
  context: CanvasRenderingContext2D
  vertices: BoundingRectVertices
  color?: string
}) {
  drawLine({
    context,
    from: nw,
    to: ne,
    color,
  })
  drawLine({
    context,
    from: ne,
    to: se,
    color,
  })
  drawLine({
    context,
    from: se,
    to: sw,
    color,
  })
  drawLine({
    context,
    from: sw,
    to: nw,
    color,
  })
}

export function drawCrossLine({
  context,
  centerPoint,
  lineLength,
}: {
  context: CanvasRenderingContext2D
  centerPoint: Point
  lineLength: number
}) {
  const LINE_WIDTH = 3
  const topLeftPoint = { x: centerPoint.x - lineLength / 2, y: centerPoint.y - lineLength / 2 }
  const { nw, ne, sw, se } = getBoundingRectVertices({
    topLeftPoint,
    width: lineLength,
    height: lineLength,
  })

  drawLine({ context, from: nw, to: se, color: '#f8f8f8', lineWidth: LINE_WIDTH })
  drawLine({ context, from: ne, to: sw, color: '#f8f8f8', lineWidth: LINE_WIDTH })
}

export function drawCrossArrow({
  context,
  centerPoint,
  lineLength,
}: {
  context: CanvasRenderingContext2D
  centerPoint: Point
  lineLength: number
}) {
  const LINE_WIDTH = 3
  const topLeftPoint = { x: centerPoint.x - lineLength / 2, y: centerPoint.y - lineLength / 2 }
  const { nw, ne, sw, se } = getBoundingRectVertices({
    topLeftPoint,
    width: lineLength,
    height: lineLength,
  })

  drawLine({ context, from: nw, to: se, color: '#f8f8f8', lineWidth: LINE_WIDTH })
  drawLine({ context, from: ne, to: sw, color: '#f8f8f8', lineWidth: LINE_WIDTH })

  drawNWCramp({
    context,
    from: nw,
    lineLength: 6,
    lineWidth: LINE_WIDTH,
    color: '#f8f8f8',
  })

  drawNECramp({
    context,
    from: ne,
    lineLength: 6,
    lineWidth: LINE_WIDTH,
    color: '#f8f8f8',
  })

  drawSWCramp({
    context,
    from: sw,
    lineLength: 6,
    lineWidth: LINE_WIDTH,
    color: '#f8f8f8',
  })

  drawSECramp({
    context,
    from: se,
    lineLength: 6,
    lineWidth: LINE_WIDTH,
    color: '#f8f8f8',
  })
}

export function drawNECramp({
  context,
  from,
  lineLength,
  lineWidth,
  color,
}: {
  context: CanvasRenderingContext2D
  from: Point
  lineLength: number
  lineWidth: number
  color: string
}) {
  const horizontalEndPoint: Point = {
    x: from.x - lineLength,
    y: from.y,
  }
  const verticalEndPoint: Point = {
    x: from.x,
    y: from.y + lineLength,
  }

  drawLine({
    context,
    from,
    to: horizontalEndPoint,
    color,
    lineWidth,
  })
  drawLine({
    context,
    from,
    to: verticalEndPoint,
    color,
    lineWidth,
  })
}

export function drawNWCramp({
  context,
  from,
  lineLength,
  lineWidth,
  color,
}: {
  context: CanvasRenderingContext2D
  from: Point
  lineLength: number
  lineWidth: number
  color: string
}) {
  const horizontalEndPoint: Point = {
    x: from.x + lineLength,
    y: from.y,
  }
  const verticalEndPoint: Point = {
    x: from.x,
    y: from.y + lineLength,
  }

  drawLine({
    context,
    from,
    to: horizontalEndPoint,
    color,
    lineWidth,
  })
  drawLine({
    context,
    from,
    to: verticalEndPoint,
    color,
    lineWidth,
  })
}

export function drawSECramp({
  context,
  from,
  lineLength,
  lineWidth,
  color,
}: {
  context: CanvasRenderingContext2D
  from: Point
  lineLength: number
  lineWidth: number
  color: string
}) {
  const horizontalEndPoint: Point = {
    x: from.x - lineLength,
    y: from.y,
  }
  const verticalEndPoint: Point = {
    x: from.x,
    y: from.y - lineLength,
  }

  drawLine({
    context,
    from,
    to: horizontalEndPoint,
    color,
    lineWidth,
  })
  drawLine({
    context,
    from,
    to: verticalEndPoint,
    color,
    lineWidth,
  })
}

export function drawSWCramp({
  context,
  from,
  lineLength,
  lineWidth,
  color,
}: {
  context: CanvasRenderingContext2D
  from: Point
  lineLength: number
  lineWidth: number
  color: string
}) {
  const horizontalEndPoint: Point = {
    x: from.x + lineLength,
    y: from.y,
  }
  const verticalEndPoint: Point = {
    x: from.x,
    y: from.y - lineLength,
  }

  drawLine({
    context,
    from,
    to: horizontalEndPoint,
    color,
    lineWidth,
  })
  drawLine({
    context,
    from,
    to: verticalEndPoint,
    color,
    lineWidth,
  })
}

export function drawArc({
  context,
  center,
  radius,
  startAngle = 0,
  endAngle,
}: {
  context: CanvasRenderingContext2D
  center: Point
  radius: number
  startAngle?: number
  endAngle: number
}) {
  context.beginPath()
  context.arc(center.x, center.y, radius, startAngle, endAngle)
  context.stroke()
}
