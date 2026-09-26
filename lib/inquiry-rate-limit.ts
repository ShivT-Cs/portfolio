type RateLimitState = {
  count: number;
  resetAt: number;
};

type EnvLike = Record<string, string | undefined>;

export type InquiryRateLimitConfig = {
  enabled: boolean;
  windowMs: number;
  maxRequests: number;
};

const PROD_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const PROD_RATE_LIMIT_MAX_REQUESTS = 5;
const DEV_RATE_LIMIT_WINDOW_MS_DEFAULT = 60 * 1000;
const DEV_RATE_LIMIT_MAX_REQUESTS_DEFAULT = 100;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function getInquiryRateLimitConfig(env: EnvLike = process.env): InquiryRateLimitConfig {
  if (env.NODE_ENV === "development") {
    const mode = env.INQUIRY_DEV_RATE_LIMIT_MODE?.toLowerCase();
    if (mode === "bypass") {
      return {
        enabled: false,
        windowMs: DEV_RATE_LIMIT_WINDOW_MS_DEFAULT,
        maxRequests: DEV_RATE_LIMIT_MAX_REQUESTS_DEFAULT,
      };
    }

    return {
      enabled: true,
      windowMs: parsePositiveInt(env.INQUIRY_DEV_RATE_LIMIT_WINDOW_MS, DEV_RATE_LIMIT_WINDOW_MS_DEFAULT),
      maxRequests: parsePositiveInt(env.INQUIRY_DEV_RATE_LIMIT_MAX, DEV_RATE_LIMIT_MAX_REQUESTS_DEFAULT),
    };
  }

  return {
    enabled: true,
    windowMs: PROD_RATE_LIMIT_WINDOW_MS,
    maxRequests: PROD_RATE_LIMIT_MAX_REQUESTS,
  };
}

export function createInquiryRateLimiter(config: InquiryRateLimitConfig) {
  const store = new Map<string, RateLimitState>();

  return {
    isRateLimited(identifier: string): boolean {
      if (!config.enabled) {
        return false;
      }

      const now = Date.now();
      const current = store.get(identifier);

      if (!current || now > current.resetAt) {
        store.set(identifier, {
          count: 1,
          resetAt: now + config.windowMs,
        });
        return false;
      }

      if (current.count >= config.maxRequests) {
        return true;
      }

      current.count += 1;
      store.set(identifier, current);
      return false;
    },
  };
}