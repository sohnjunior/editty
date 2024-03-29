export interface Point {
  x: number
  y: number
}

export interface Vector {
  begin: Point
  end: Point
}

export interface BoundingRect {
  /** top-left x position */
  sx: number
  /** top-left y position */
  sy: number
  width: number
  height: number
  degree: number
}

export interface BoundingRectVertices {
  nw: Point
  ne: Point
  sw: Point
  se: Point
}
