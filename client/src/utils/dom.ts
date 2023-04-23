export function getGlobalColorPalette({
  canvas,
  color,
}: {
  canvas: HTMLCanvasElement
  color: `--color-${string}`
}) {
  return getComputedStyle(canvas).getPropertyValue(color)
}

export function setMouseCursor(cursorType: string) {
  document.body.style.cursor = cursorType
}

export function isTouchEvent(e: unknown): e is TouchEvent {
  return window.TouchEvent && e instanceof TouchEvent
}

export function getSlotNodes(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedNodes() ?? []
}

export function getSlotElements(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedElements() ?? []
}
