/**
 * web component 테스트를 위한 dom query 입니다.
 */

/** 스타일태그를 제외하고 해당 web component 의 template root element 를 반환합니다. */
export function getTemplateRootElement<T>(element: HTMLElement) {
  const children = element.shadowRoot?.children ?? []
  const rootElement = [...children].find((element) => !(element instanceof HTMLStyleElement))

  return rootElement as T
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
