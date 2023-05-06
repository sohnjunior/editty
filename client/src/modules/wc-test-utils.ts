/**
 * 🧪 test utilities for web component
 */

/** 스타일태그를 제외하고 해당 web component 의 template root element 를 반환합니다. */
export function getTemplateRootElement<T>(element: HTMLElement) {
  const children = element.shadowRoot?.children ?? []
  const rootElement = [...children].find((element) => !(element instanceof HTMLStyleElement))

  return rootElement as T
}

/** render htmlString and wait for style initialize */
export async function renderToHtml(renderHtml: string) {
  document.body.innerHTML = renderHtml
  await waitWCStyleInit()
}

/** 대상 web component 의 initStyle 훅에서 설정된 스타일값을 가져옵니다.  */
export async function getInitialStyle(element: HTMLElement) {
  await waitWCStyleInit()

  return element.style
}

/** web component initial style 이 적용되는 것을 기다립니다. */
export async function waitWCStyleInit() {
  await waitRAF()
}

function waitRAF() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

/** cleanup document for isolation test */
export function cleanup() {
  document.body.innerHTML = ''
}

/** @deprecated document 를 로드한 뒤 data-testid 로 노드를 찾도록 변경해주세요. */
export function getSlotNodes(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedNodes() ?? []
}

/** @deprecated document 를 로드한 뒤 data-testid 로 노드를 찾도록 변경해주세요. */
export function getSlotElements(target: Element | null, slotName?: string) {
  const selector = slotName ? `slot[name="${slotName}"]` : 'slot'
  const slotElement: HTMLSlotElement | null = target?.shadowRoot?.querySelector(selector) ?? null

  return slotElement?.assignedElements() ?? []
}
