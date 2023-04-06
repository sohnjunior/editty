export function lastOf<T>(list: T[]): T | undefined {
  return list.slice(-1)[0]
}
