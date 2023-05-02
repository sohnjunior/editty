export interface Point {
  x: number
  y: number
}

export interface BoundingRect {
  /** top-left x position */
  sx: number
  /** top-left y position */
  sy: number
  width: number
  height: number
}

export interface ImageObject extends BoundingRect {
  /** image dataUrl */
  dataUrl: string
  /** image element ref derived from this ImageObject */
  ref?: HTMLImageElement
}

export interface DragTarget {
  /** drag start x */
  sx: number
  /** drag start y */
  sy: number
  /** related ImageObject entity */
  image: ImageObject
}

export type Resize = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
export type ImageTransform = Resize
export interface Anchor {
  type: ImageTransform
  path2d: Path2D
}
