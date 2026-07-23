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
    return {
      totalKeys: keys.length,
      keys: keys.slice(0, 10), // First 10 keys for preview
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
