export function setDeviceCursor(cursorType: string) {
  document.body.style.cursor = cursorType
}

export function isTouchEvent(e: unknown): e is TouchEvent {
  return window.TouchEvent && e instanceof TouchEvent
}
