import type { ImageObject } from '@molecules/canvas-layer/types'
import type { Point } from './types'

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
  const id = crypto.randomUUID()

  return new Promise((resolve, reject) => {
    const $image = new Image()
    $image.src = dataUrl

    $image.onload = () => {
      resolve({
        id,
        dataUrl,
        sx: topLeftPoint.x,
        sy: topLeftPoint.y,
        width: $image.width,
        height: $image.height,
        degree: 0,
        ref: $image,
      })
    }

    $image.onerror = () => {
      reject()
    }
  })
}
