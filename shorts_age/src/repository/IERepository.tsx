import type {
  IRepository,
  RepositoryEntry,
  RepositoryValue,
} from "./IRepository"

type StoredRepositoryRecord<T extends RepositoryValue> = {
  tableName: string
  key: string
  value: T
}

export class IERepository implements IRepository {
  private readonly prefix = "shorts-age-repository"

  async put<T extends RepositoryValue>(
    tableName: string,
    key: string,
    value: T,
  ): Promise<void> {
    localStorage.setItem(
      this.createStorageKey(tableName, key),
      JSON.stringify({ tableName, key, value }),
    )
  }

  async bulkPut<T extends RepositoryValue>(
    tableName: string,
    keys: string[],
    values: T[],
  ): Promise<void> {
    if (keys.length !== values.length) {
      throw new Error("bulkPut requires keys and values to have the same length")
    }

    const groupKey = "data"
    const value = keys.reduce<Record<string, T>>((record, key, index) => {
      record[key] = values[index]
      return record
    }, {})

    localStorage.setItem(
      this.createStorageKey(tableName, groupKey),
      JSON.stringify({ tableName, key: groupKey, value }),
    )
  }

  async get<T extends RepositoryValue>(
    tableName: string,
    key: string,
  ): Promise<T | undefined> {
    const item = localStorage.getItem(this.createStorageKey(tableName, key))

    if (!item) {
      return undefined
    }

    return this.parseRecord<T>(item)?.value
  }

  async getAll<T extends RepositoryValue>(
      tableName: string,
    ): Promise<RepositoryEntry<T>[]> {
      const entries: RepositoryEntry<T>[] = []
      const tablePrefix = this.createTablePrefix(tableName)

      for (let index = 0; index < localStorage.length; index += 1) {
        const storageKey = localStorage.key(index)

        if (!storageKey?.startsWith(tablePrefix)) {
          continue
        }

        const item = localStorage.getItem(storageKey)
        const record = item ? this.parseRecord<T>(item) : undefined

        if (record) {
          entries.push({
            key: record.key,
            value: record.value,
          })
        }
      }

  return entries
}

  async remove(tableName: string, key: string): Promise<void> {
    localStorage.removeItem(this.createStorageKey(tableName, key))
  }

  async clear(tableName: string): Promise<void> {
    const tablePrefix = this.createTablePrefix(tableName)
    const keysToRemove: string[] = []

    for (let index = 0; index < localStorage.length; index += 1) {
      const storageKey = localStorage.key(index)

      if (storageKey?.startsWith(tablePrefix)) {
        keysToRemove.push(storageKey)
      }
    }

    keysToRemove.forEach((storageKey) => localStorage.removeItem(storageKey))
  }

  private createTablePrefix(tableName: string): string {
    return `${this.prefix}:${tableName}:`
  }

  private createStorageKey(tableName: string, key: string): string {
    return `${this.createTablePrefix(tableName)}${key}`
  }

  private parseRecord<T extends RepositoryValue>(
    item: string,
  ): StoredRepositoryRecord<T> | undefined {
    try {
      return JSON.parse(item) as StoredRepositoryRecord<T>
    } catch {
      return undefined
    }
  }
}
