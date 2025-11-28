// Simple in-memory cache for Firebase data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultExpiry = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, expiryMs: number = this.defaultExpiry): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiryMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiry;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const dataCache = new DataCache();

// Helper function for cached Firebase fetches
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiryMs: number = 5 * 60 * 1000
): Promise<T> {
  // Check cache first
  const cached = dataCache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  dataCache.set(key, data, expiryMs);
  return data;
}

export default dataCache;
