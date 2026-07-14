import { ChrominumRepository } from "./ChrominumRepository"
import { IERepository } from "./IERepository"
import { Logger } from "../lib/LogUtil"

export type RepositoryEntry<T extends RepositoryValue = RepositoryValue> = {
  key: string
  value: T
}
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
    recordId:string,
    key: string,
    value: T,
  ): Promise<void>

  bulkPut<T extends RepositoryValue>(
    tableName: string,
    recordId:string,
    keys: string[],
    values: T[],
  ): Promise<void>

  get<T extends RepositoryValue>(
    tableName: string,
    recordId:string,
    key: string,
  ): Promise<T | undefined>

  getAll<T extends RepositoryValue>(
    tableName: string,
  ): Promise<RepositoryEntry<T>[]>

  remove(tableName: string, recordId: string): Promise<void>
  clear(tableName: string): Promise<void>
}

export function isIEBrowser(
  userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent,
): boolean {
  return /MSIE |Trident\//.test(userAgent)
}

export function createRepository(): IRepository {

  Logger(`IRepository Initialize ${navigator.userAgent}`);

  if (isIEBrowser()) {
    return new IERepository()
  }

  return new ChrominumRepository()
}

export const repository = createRepository()
