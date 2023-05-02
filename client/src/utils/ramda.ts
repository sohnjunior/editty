export function lastOf<T>(list: T[]): T | undefined {
  return list.slice(-1)[0]
}

export function filterNullish<T>(array: T[]) {
  return array.filter<Exclude<T, null | undefined>>((el): el is Exclude<T, null | undefined> =>
    Boolean(el)
  )
}

export function findLastIndexOf<T>(array: T[], condition: (element: T) => boolean) {
  let idx = array.length

  while (--idx >= 0) {
    if (condition(array[idx])) {
      break
    }
  }

  return idx
}
