import type { BoundingRect } from '@/modules/canvas-utils/types'

export interface ImageObject extends BoundingRect {
  /** image dataUrl */
  dataUrl: string
  /** image element ref derived from this ImageObject */
  ref?: HTMLImageElement
}

export type Resize = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
export type ImageTransform = Resize
export interface Anchor {
  type: ImageTransform
  path2d: Path2D
}
