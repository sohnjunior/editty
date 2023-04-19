export function lastOf<T>(list: T[]): T | undefined {
  return list.slice(-1)[0]
}

export function filterNullish<T>(array: T[]) {
  return array.filter<Exclude<T, null | undefined>>((el): el is Exclude<T, null | undefined> =>
    Boolean(el)
  )
}
