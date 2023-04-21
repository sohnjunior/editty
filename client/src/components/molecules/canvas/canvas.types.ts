export interface Point {
  x: number
  y: number
}

export interface ImageObject {
  /** image dataUrl */
  dataUrl: string
  /** top-left x position */
  sx: number
  /** top-left y position */
  sy: number
  /** image width */
  width: number
  /** image height */
  height: number
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
