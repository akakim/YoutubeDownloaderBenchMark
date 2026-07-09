import { ChrominumRepository } from "./ChrominumRepository"
import { IERepository } from "./IERepository"

export type RepositoryValue =
  | string
  | number
  | boolean
  | null
  | RepositoryValue[]
  | { [key: string]: RepositoryValue }

export interface IRepository {
  put<T extends RepositoryValue>(
    tableName: string,
    key: string,
    value: T,
  ): Promise<void>
  get<T extends RepositoryValue>(
    tableName: string,
    key: string,
  ): Promise<T | undefined>
  getAll<T extends RepositoryValue>(tableName: string): Promise<T[]>
  remove(tableName: string, key: string): Promise<void>
  clear(tableName: string): Promise<void>
}

export function isIEBrowser(
  userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent,
): boolean {
  return /MSIE |Trident\//.test(userAgent)
}

export function createRepository(): IRepository {
  if (isIEBrowser()) {
    return new IERepository()
  }

  return new ChrominumRepository()
}

export const repository = createRepository()
