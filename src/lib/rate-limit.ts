/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Split into a non-mutating `checkLimit` and a mutating `consumeLimit` so a
 * caller can decide what actually counts against a quota. That matters for
 * forms: counting every rejected request would mean a customer who mistypes
 * their phone number a few times is locked out, which punishes the honest user
 * far more than the bot.
 *
 * Scope is deliberately modest — state lives in the process, so it does not
 * hold across instances on serverless hosting. Put a shared store (Redis,
 * Upstash) or the platform's WAF in front before relying on it in production.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Bounds memory if a burst of unique keys arrives. */
const MAX_TRACKED_KEYS = 10_000;

export interface LimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

function prune(now: number): void {
  if (windows.size < MAX_TRACKED_KEYS) return;

  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }

  // Still full of live windows — drop the oldest to stay bounded.
  if (windows.size >= MAX_TRACKED_KEYS) {
    const oldest = windows.keys().next().value;
    if (oldest) windows.delete(oldest);
  }
}

/** Reads the current state without counting the request. */
export function checkLimit(key: string, { limit }: Pick<LimitOptions, "limit">): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    return { ok: true, remaining: limit, retryAfter: 0 };
  }

  return {
    ok: existing.count < limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Counts one request against the window and returns the resulting state. */
export function consumeLimit(
  key: string,
  { limit, windowMs }: LimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    prune(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;

  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Best-effort client identifier.
 *
 * `x-forwarded-for` is client-controlled unless a trusted proxy overwrites it,
 * so this is a throttling hint, not authentication — it never gates access to
 * anything sensitive.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}
