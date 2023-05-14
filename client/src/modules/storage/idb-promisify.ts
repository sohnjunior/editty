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
  key: string
}

export async function retrieveData<T>({ db, storeName, key }: DBTransactionParam): Promise<T> {
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
