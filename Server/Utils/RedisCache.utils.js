import redis, { CACHE_KEYS, CACHE_TTL } from "../config/redis.config.js";
export { CACHE_KEYS, CACHE_TTL };
/**
 * Redis Cache Utility
 * Provides caching functions for optimal performance with 1000+ users
 */

// Generic cache functions
export const cacheGet = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error.message);
    return null;
  }
};

export const cacheSet = async (key, data, ttl = CACHE_TTL.MEDIUM) => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    return true;
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error.message);
    return false;
  }
};

export const cacheDelete = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error.message);
    return false;
  }
};

export const cacheDeletePattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error(`Cache delete pattern error for ${pattern}:`, error.message);
    return false;
  }
};

// Cached data fetcher - reduces DB load
export const cachedFetch = async (
  cacheKey,
  fetchFn,
  ttl = CACHE_TTL.MEDIUM
) => {
  // Try to get from cache first
  const cachedData = await cacheGet(cacheKey);
  if (cachedData) {
    console.log(`📦 Cache hit: ${cacheKey}`);
    return cachedData;
  }

  // Cache miss - fetch from database
  console.log(`🔄 Cache miss: ${cacheKey}`);
  const freshData = await fetchFn();

  // Store in cache
  await cacheSet(cacheKey, freshData, ttl);

  return freshData;
};

// Invalidate cache after data changes
export const invalidateCache = async (keyPattern) => {
  await cacheDeletePattern(keyPattern);
  console.log(`🗑️ Cache invalidated: ${keyPattern}`);
};

// Get multiple cache keys at once
export const cacheGetMany = async (keys) => {
  try {
    const values = await redis.mget(...keys);
    return keys.map((key, index) => {
      try {
        return values[index] ? JSON.parse(values[index]) : null;
      } catch {
        return null;
      }
    });
  } catch (error) {
    console.error("Cache getMany error:", error.message);
    return keys.map(() => null);
  }
};

// Set multiple keys at once
export const cacheSetMany = async (keyValuePairs, ttl = CACHE_TTL.MEDIUM) => {
  try {
    const pipeline = redis.pipeline();
    keyValuePairs.forEach(({ key, value }) => {
      pipeline.set(key, JSON.stringify(value), "EX", ttl);
    });
    await pipeline.exec();
    return true;
  } catch (error) {
    console.error("Cache setMany error:", error.message);
    return false;
  }
};

// Increment counter (useful for rate limiting)
export const cacheIncrement = async (key, ttl = 60) => {
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, ttl);
    }
    return count;
  } catch (error) {
    console.error("Cache increment error:", error.message);
    return 0;
  }
};

// Check if key exists
export const cacheExists = async (key) => {
  try {
    return await redis.exists(key);
  } catch (error) {
    console.error("Cache exists error:", error.message);
    return false;
  }
};

// Set cache with custom expiration
export const cacheSetEx = async (key, data, expiresAt) => {
  try {
    const ttl = Math.max(Math.floor((expiresAt - Date.now()) / 1000), 1);
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    return true;
  } catch (error) {
    console.error(`Cache setEx error for key ${key}:`, error.message);
    return false;
  }
};

// Session cache functions
export const cacheSession = async (userId, sessionData, ttl = 86400) => {
  const key = `${CACHE_KEYS.USER_STATS}${userId}:session`;
  return cacheSet(key, sessionData, ttl);
};

export const getCachedSession = async (userId) => {
  const key = `${CACHE_KEYS.USER_STATS}${userId}:session`;
  return cacheGet(key);
};

export const deleteCachedSession = async (userId) => {
  const key = `${CACHE_KEYS.USER_STATS}${userId}:session`;
  return cacheDelete(key);
};

export default {
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
  cachedFetch,
  invalidateCache,
  cacheGetMany,
  cacheSetMany,
  cacheIncrement,
  cacheExists,
  cacheSetEx,
  cacheSession,
  getCachedSession,
  deleteCachedSession,
};
