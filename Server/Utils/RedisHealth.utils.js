import redis from "../config/redis.config.js";

/**
 * Redis Health Check Utility
 * Provides health check functionality for Redis connection
 */

export const checkRedisHealth = async () => {
  try {
    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;

    return {
      status: "healthy",
      latency,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const getRedisInfo = async () => {
  try {
    const info = await redis.info("memory");

    return {
      info,
      connected: true,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};

export const getCacheStats = async () => {
  try {
    const keys = await redis.keys("*");

    const cache = await Promise.all(
      keys.slice(0, 10).map(async (key) => {
        try {
          const type = await redis.type(key);

          let value;

          switch (type) {
            case "string":
              value = await redis.get(key);
              break;

            case "hash":
              value = await redis.hGetAll(key);
              break;

            case "list":
              value = await redis.lRange(key, 0, -1);
              break;

            case "set":
              value = await redis.sMembers(key);
              break;

            case "zset":
              value = await redis.zRangeWithScores(key, 0, -1);
              break;

            default:
              value = `Unsupported Redis type: ${type}`;
          }

          return {
            key,
            type,
            value,
          };
        } catch (error) {
          return {
            key,
            error: error.message,
          };
        }
      })
    );

    return {
      totalKeys: keys.length,
      // cache, 
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const clearAllCache = async () => {
  try {
    await redis.flushdb();
    return { success: true, message: "All cache cleared" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  checkRedisHealth,
  getRedisInfo,
  getCacheStats,
  clearAllCache,
};
