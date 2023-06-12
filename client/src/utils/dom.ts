export function setMouseCursor(cursorType: string) {
  document.body.style.cursor = cursorType
}

export function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches
}
