type Key = string
type Handler = (...payload: any[]) => void
type UnsubscribeFunc = () => void

interface Bus {
  on(key: Key, handler: Handler): UnsubscribeFunc
  off(key: Key, handler: Handler): void
  emit(key: Key, ...payload: Parameters<Handler>): void
  once(key: Key, handler: Handler): void
}

export default class EventBus implements Bus {
  #record: Map<Key, Handler[]>
  static #instance: EventBus

  constructor() {
    this.#record = new Map()
  }

  get record() {
    return this.#record
  }

  public static getInstance() {
    if (!this.#instance) {
      this.#instance = new EventBus()
    }

    return this.#instance
  }

  public on(key: Key, handler: Handler) {
    if (!this.#record.has(key)) {
      this.#record.set(key, [])
    }

    const queue = this.#record.get(key)
    queue?.push(handler)

    return () => {
      this.off(key, handler)
    }
  }

  public off(key: Key, handler: Handler) {
    const index = this.#record.get(key)?.indexOf(handler) ?? -1
    this.#record.get(key)?.splice(index >>> 0, 1)
  }

  public emit(key: Key, ...payload: any[]) {
    const handlers = this.#record.get(key)
    handlers?.forEach((handler) => handler(...payload))
  }

  public once(key: Key, handler: Handler) {
    const handleOnce = (...payload: any[]) => {
      handler(...payload)
      this.off(key, handleOnce)
    }

    this.on(key, handleOnce)
  }
}
