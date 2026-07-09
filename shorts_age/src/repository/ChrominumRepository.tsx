import type { IRepository, RepositoryValue } from "./IRepository"

type IndexedRepositoryRecord<T extends RepositoryValue = RepositoryValue> = {
  id: string
  tableName: string
  key: string
  value: T
}

export class ChrominumRepository implements IRepository {
  private readonly dbName = "shorts-age-repository"
  private readonly dbVersion = 1
  private readonly storeName = "records"
  private dbPromise?: Promise<IDBDatabase>

  async put<T extends RepositoryValue>(
    tableName: string,
    key: string,
    value: T,
  ): Promise<void> {
    const record: IndexedRepositoryRecord<T> = {
      id: this.createRecordId(tableName, key),
      tableName,
      key,
      value,
    }

    await this.runStoreRequest("readwrite", (store) => store.put(record))
  }

  async get<T extends RepositoryValue>(
    tableName: string,
    key: string,
  ): Promise<T | undefined> {
    const record = await this.runStoreRequest<IndexedRepositoryRecord<T>>(
      "readonly",
      (store) => store.get(this.createRecordId(tableName, key)),
    )

    return record?.value
  }

  async getAll<T extends RepositoryValue>(tableName: string): Promise<T[]> {
    const records = await this.runStoreRequest<IndexedRepositoryRecord<T>[]>(
      "readonly",
      (store) => store.getAll(),
    )

    return records
      .filter((record) => record.tableName === tableName)
      .map((record) => record.value)
  }

  async remove(tableName: string, key: string): Promise<void> {
    await this.runStoreRequest("readwrite", (store) =>
      store.delete(this.createRecordId(tableName, key)),
    )
  }

  async clear(tableName: string): Promise<void> {
    const records = await this.runStoreRequest<IndexedRepositoryRecord[]>(
      "readonly",
      (store) => store.getAll(),
    )

    await Promise.all(
      records
        .filter((record) => record.tableName === tableName)
        .map((record) => this.remove(record.tableName, record.key)),
    )
  }

  private openDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)

        request.onupgradeneeded = () => {
          const db = request.result

          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "id" })
          }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }

    return this.dbPromise
  }

  private async runStoreRequest<T = undefined>(
    mode: IDBTransactionMode,
    createRequest: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, mode)
      const store = transaction.objectStore(this.storeName)
      const request = createRequest(store)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  private createRecordId(tableName: string, key: string): string {
    return `${tableName}:${key}`
  }
}
