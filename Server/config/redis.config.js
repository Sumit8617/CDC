import Redis from "ioredis";

// Redis configuration for caching and session management
// Optimized for 1000+ concurrent users

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  lazyConnect: false,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

// Handle Redis connection events
redis.on("connect", () => {
  console.log(" Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

redis.on("ready", () => {
  console.log("🚀 Redis is ready for use");
});

// Cache key prefixes for better organization
export const CACHE_KEYS = {
  CONTESTS: "contests:",
  CONTEST_DETAILS: "contest:details:",
  LEADERBOARD: "leaderboard:",
  USER_STATS: "user:stats:",
  USER_PERFORMANCE: "user:performance:",
  UPCOMING_CONTESTS: "contests:upcoming",
  QUESTION_DETAILS: "question:",
  TEST_DETAILS: "test:details:",
  LEADERBOARD_LIST: "leaderboard:list",
  USER_DASHBOARD: "user:dashboard:",
};

// Cache TTL values (in seconds)
export const CACHE_TTL = {
  CONTESTS: 300, // 5 minutes - contests don't change often
  CONTEST_DETAILS: 180, // 3 minutes
  LEADERBOARD: 600, // 10 minutes - leaderboard updates after contest ends
  USER_STATS: 300, // 5 minutes
  USER_PERFORMANCE: 600, // 10 minutes
  UPCOMING_CONTESTS: 120, // 2 minutes
  QUESTION_DETAILS: 3600, // 1 hour - questions rarely change
  TEST_DETAILS: 300, // 5 minutes
  LEADERBOARD_LIST: 300, // 5 minutes
  USER_DASHBOARD: 180, // 3 minutes
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
};

export default redis;
