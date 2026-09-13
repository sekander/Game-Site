// src/utils/cache.js
export class CacheManager {
  constructor(prefix = 'fnky') {
    this.prefix = prefix;
    this.memoryCache = new Map();
    this.pendingRequests = new Map();
  }

  set(key, data, ttl = 30 * 60 * 1000) {
    const cacheKey = `${this.prefix}_${key}`;
    const cacheData = { 
      data, 
      expiry: Date.now() + ttl,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      this.memoryCache.set(key, cacheData);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.clearOldCache();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
          console.warn('Cache set failed:', e);
        }
      }
    }
  }

  get(key) {
    const cacheKey = `${this.prefix}_${key}`;
    
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (Date.now() < cached.expiry) {
        return cached.data;
      }
      this.memoryCache.delete(key);
    }
    
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      
      const cached = JSON.parse(raw);
      if (Date.now() > cached.expiry) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      this.memoryCache.set(key, cached);
      return cached.data;
    } catch (error) {
      return null;
    }
  }

  clearOldCache() {
    const keys = Object.keys(localStorage);
    const prefix = this.prefix;
    
    const items = keys
      .filter(key => key.startsWith(prefix))
      .map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return { key, timestamp: data.timestamp || 0 };
        } catch {
          return { key, timestamp: 0 };
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const removeCount = Math.floor(items.length * 0.3);
    items.slice(0, removeCount).forEach(item => {
      localStorage.removeItem(item.key);
    });
  }

  clear() {
    this.memoryCache.clear();
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.prefix}_`))
      .forEach(key => localStorage.removeItem(key));
  }
}

export const cacheManager = new CacheManager('fnky');
