import type { BoundingRect } from '@/modules/canvas-engine/types'

export interface ImageObject extends BoundingRect {
  /** image id */
  id: string
  /** image dataUrl */
  dataUrl: string
  /** image element ref derived from this ImageObject */
  ref?: HTMLImageElement
}

export type ImageTransform = 'RESIZE' | 'DELETE' | 'ROTATE'
export interface Anchor {
  type: ImageTransform
  path2d: Path2D
}
