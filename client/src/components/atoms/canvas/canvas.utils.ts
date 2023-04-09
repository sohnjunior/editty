import type { PencilPoint } from './canvas.types'

export function isTouchEvent(e: unknown): e is TouchEvent {
  return window.TouchEvent && e instanceof TouchEvent
}

/**
 * 캔버스 요소 기준으로 선택된 터치(혹은 클릭) 지점을 px 단위로 반환합니다.
 * @param canvas 대상 캔버스 요소
 * @param ev MouseEvent 혹은 TouchEvent
 */
export function getSyntheticTouchPoint(canvas: HTMLCanvasElement, ev: MouseEvent | TouchEvent) {
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

/**
 * 2차원 평면좌표에서 두 지점 사이의 중간 지점을 반환합니다.
 * @param p1 2차원 평면좌표 A
 * @param p2 2차원 평면좌표 B
 */
export function getMiddlePoint(p1: PencilPoint, p2: PencilPoint) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

export function fillBackgroundColor(canvas: HTMLCanvasElement, color: string) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

export function getSnapshot(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  return context.getImageData(0, 0, canvas.width, canvas.height)
}

export function setSnapshot(canvas: HTMLCanvasElement, snapshot: ImageData) {
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

export function refineCanvasRatio(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  const ratio = window.devicePixelRatio
  const { width, height } = getComputedStyle(canvas)

  canvas.width = parseInt(width) * ratio
  canvas.height = parseInt(height) * ratio
}
