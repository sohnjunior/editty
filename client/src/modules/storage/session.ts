export default class SessionStorage {
  private static instance: SessionStorage
  private storage!: Storage

  private constructor() {
    if (!window.sessionStorage) {
      throw new Error('🚨 current browser does not support session storage')
    }
  }

  initialize() {
    this.storage = window.sessionStorage
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SessionStorage()
    }

    return this.instance
  }

  getItem<T>(key: string) {
    try {
      const item = this.storage.getItem(key)
      if (!item) {
        return
      }

      return JSON.parse(item) as T
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error('🚨 item is not valid JSON format string')
        return
      }
      throw err
    }
  }

  setItem(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  removeItem(key: string) {
    this.storage.removeItem(key)
  }
}
