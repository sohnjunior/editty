import type { PencilPoint, ImageObject } from './canvas.types'

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

/**
 * (sx, sy) 를 좌측 최상단으로 하는 width 너비, height 높이를 가지는 정사각형 영역에 (x, y) 가 포함되는지 판단합니다.
 */
export function isPointInsideRect({
  pivot,
  pos,
}: {
  pivot: { sx: number; sy: number; width: number; height: number }
  pos: { x: number; y: number }
}) {
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
 * @param image base64 인코딩된 dataUrl 이미지
 * @param position image top-left 좌표값
 * @param size image 사이즈
 */
export async function createImageObject(
  image: { dataUrl: string },
  position: { sx: number; sy: number }
): Promise<ImageObject> {
  return new Promise((resolve, reject) => {
    const $image = new Image()
    $image.src = image.dataUrl

    $image.onload = () => {
      resolve({
        dataUrl: image.dataUrl,
        sx: position.sx,
        sy: position.sy,
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
