import localforage from 'localforage'
import { DateTime } from 'luxon'

type CachedItem<T> = {
  element: T
  usedAt: number
}

const isQuotaExceededError = (error: unknown): boolean => {
  if (!(error instanceof DOMException)) {
    return false
  }

  return (
    error.code === 22 ||
    error.code === 1014 ||
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  )
}

export class LocalforageCache<T> {
  private instance: LocalForage

  constructor(private cacheKey: string) {
    this.instance = localforage.createInstance({
      name: cacheKey,
      driver: localforage.INDEXEDDB,
      storeName: cacheKey,
    })
  }

  private key = (id: string): string => {
    return `${this.cacheKey}:${id}`
  }

  private evictLRU = async (): Promise<void> => {
    let lru: { diffSeconds: number; key: string } | undefined = undefined

    await this.instance.iterate<CachedItem<T>, void>(async (value, key) => {
      const usedAt = DateTime.fromSeconds(value.usedAt)
      const now = DateTime.now()
      const diff = now.diff(usedAt, 'seconds')

      if (!lru || diff.seconds > lru.diffSeconds) {
        lru = { diffSeconds: diff.seconds, key }
      }
    })

    const { diffSeconds, key } = lru || { diffSeconds: 0, key: '' }

    if (!diffSeconds || !key) {
      // Emerg! Cannot find any item to evict, so clear the entire cache to
      // avoid throwing
      console.warn(
        `LocalforageCache: No items found to evict in cache "${this.cacheKey}", clearing entire db`
      )
      await this.instance.clear()
      return
    }

    await this.instance.removeItem(key)
  }

  public async get(id: string): Promise<T | undefined> {
    const item = await this.instance.getItem<CachedItem<T>>(this.key(id))

    if (!item) {
      return
    }

    // Store it to update the usedAt timestamp
    await this.set(id, item.element)

    return item.element
  }

  public async set(id: string, element: T): Promise<boolean> {
    const usedAt = DateTime.now().toUnixInteger()

    try {
      await this.instance.setItem<CachedItem<T>>(this.key(id), { element, usedAt })
      return true
    } catch (error) {
      if (isQuotaExceededError(error)) {
        await this.evictLRU()
        await this.instance.setItem<CachedItem<T>>(this.key(id), { element, usedAt })
        return true
      }

      return false
    }
  }
}
