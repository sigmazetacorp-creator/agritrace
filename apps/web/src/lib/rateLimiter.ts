/**
 * Simple in-memory rate limiter for Next.js API routes
 * Tracks requests by IP address and enforces rate limits per time window
 */

interface RateLimitEntry {
  timestamp: number
  count: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 60 seconds
const CLEANUP_INTERVAL = 60000
const CLEANUP_AGE = 15 * 60000 // Keep entries for 15 minutes

setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []

  rateLimitStore.forEach((entry, key) => {
    if (now - entry.timestamp > CLEANUP_AGE) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach(key => rateLimitStore.delete(key))
}, CLEANUP_INTERVAL)

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 15 * 60000, // 15 minutes
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address or email)
 * @param options - Rate limit options
 * @returns true if rate limited, false if request is allowed
 */
export function isRateLimited(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): boolean {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Create new entry if doesn't exist
  if (!entry) {
    rateLimitStore.set(identifier, { timestamp: now, count: 1 })
    return false
  }

  // Check if window has expired
  if (now - entry.timestamp > config.windowMs) {
    rateLimitStore.set(identifier, { timestamp: now, count: 1 })
    return false
  }

  // Increment count and check against limit
  entry.count++
  return entry.count > config.maxRequests
}

/**
 * Get remaining requests for an identifier
 */
export function getRemainingRequests(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): number {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const entry = rateLimitStore.get(identifier)

  if (!entry) {
    return config.maxRequests
  }

  const now = Date.now()
  if (now - entry.timestamp > config.windowMs) {
    return config.maxRequests
  }

  return Math.max(0, config.maxRequests - entry.count)
}

/**
 * Get time until limit resets for an identifier
 */
export function getResetTime(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): number {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const entry = rateLimitStore.get(identifier)

  if (!entry) {
    return 0
  }

  const now = Date.now()
  const age = now - entry.timestamp

  if (age > config.windowMs) {
    return 0
  }

  return config.windowMs - age
}
