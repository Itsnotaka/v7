import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

// Singleton Redis client
const globalForRedis = globalThis as unknown as { redis: Redis | undefined }

export const redis = globalForRedis.redis ?? new Redis(REDIS_URL)

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}
