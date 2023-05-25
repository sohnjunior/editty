import {
  createObjectStore,
  retrieveData,
  retrieveAllData,
  putData,
  deleteData,
} from './idb-promisify'
import type { DatabaseConfig, StoreConfig } from './idb-promisify'
import { showToast } from '@/services/toast'

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

  async getAllItems<T>() {
    try {
      return await retrieveAllData<T>({ db: this.idb, storeName: STORE_NAME })
    } catch (err) {
      console.error(err)
    }
  }

  async addItem(value: any) {
    try {
      await putData({ db: this.idb, storeName: STORE_NAME, value })
      showToast('ADD_ARCHIVE', 'SUCCESS')
    } catch (err) {
      showToast('ADD_ARCHIVE', 'FAIL')
    }
  }

  async addOrUpdateItem(value: any) {
    try {
      await putData({ db: this.idb, storeName: STORE_NAME, value })
      showToast('SAVE_ARCHIVE', 'SUCCESS')
    } catch (err) {
      showToast('SAVE_ARCHIVE', 'FAIL')
    }
  }

  async deleteItem(key: string) {
    try {
      await deleteData({ db: this.idb, storeName: STORE_NAME, key })
    } catch (err) {
      throw err
    }
  }
}
