export type UUID = `${string}-${string}-${string}-${string}-${string}`

export function getRandomUUID(): UUID {
  return window.crypto.randomUUID() as UUID
}
