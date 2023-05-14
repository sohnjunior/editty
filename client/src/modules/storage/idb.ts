import { createObjectStore, retrieveData } from './idb-promisify'
import type { DatabaseConfig, StoreConfig } from './idb-promisify'

const DATABASE_CONFIG: DatabaseConfig = {
  name: 'editty',
  version: 1,
}

const STORE_CONFIG: StoreConfig = {
  storeName: 'archive',
  keyPath: 'id',
}

const STORE_NAME = 'archive'

export default class IndexedDB {
  private static instance: IndexedDB
  private idb!: IDBDatabase

  private constructor() {
    if (!window.indexedDB) {
      throw new Error('🚨 current browser does not support indexedDB')
    }
  }

  async initialize() {
    try {
      const config = {
        ...DATABASE_CONFIG,
        ...STORE_CONFIG,
      }
      this.idb = await createObjectStore(config)
    } catch (err) {
      console.error(err)
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexedDB()
    }

    return this.instance
  }

  async getItem<T>(key: string) {
    try {
      return await retrieveData<T>({ db: this.idb, storeName: STORE_NAME, key })
    } catch (err) {
      console.error(err)
    }
  }

  addOrUpdateItem(value: any) {
    const transaction = this.idb.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    objectStore.put(value)
  }

  deleteItem(key: string) {
    const transaction = this.idb.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    objectStore.delete(key)
  }
}
