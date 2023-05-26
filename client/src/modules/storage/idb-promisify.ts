export interface DatabaseConfig {
  name: string
  version: number
}

export interface StoreConfig {
  storeName: string
  keyPath: string
}

export async function createObjectStore({
  name,
  version,
  storeName,
  keyPath,
}: DatabaseConfig & StoreConfig): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version)

    request.onupgradeneeded = (ev: Event) => {
      const database = (ev.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath })
      }
    }

    request.onsuccess = (ev: Event) => {
      const database = (ev.target as IDBOpenDBRequest).result
      resolve(database)
    }

    request.onerror = () => {
      reject(new Error('🚨 fail to initialize indexedDB. please check permission.'))
    }
  })
}

interface DBTransactionParam {
  db: IDBDatabase
  storeName: string
}

interface DBGetTransactionParam extends DBTransactionParam {
  key: string
}

export async function retrieveData<T>({ db, storeName, key }: DBGetTransactionParam): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.get(key)

    request.onsuccess = (ev: Event) => {
      const data = (ev.target as IDBRequest).result
      resolve(data)
    }

    request.onerror = () => {
      reject()
    }
  })
}

export async function retrieveAllData<T>({ db, storeName }: DBTransactionParam): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.getAll()

    request.onsuccess = (ev: Event) => {
      const data = (ev.target as IDBRequest).result as T[]
      resolve(data)
    }

    request.onerror = () => {
      reject()
    }
  })
}

interface DBPutTransactionParam extends DBTransactionParam {
  value: any
}

export async function putData({ db, storeName, value }: DBPutTransactionParam) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.put(value)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject()
  })
}

interface DBDeleteTransactionParam extends DBTransactionParam {
  key: string
}

export async function deleteData({ db, storeName, key }: DBDeleteTransactionParam) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.delete(key)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject()
  })
}
