import test from "node:test";
import assert from "node:assert/strict";
import { createInquiryRateLimiter, getInquiryRateLimitConfig } from "../lib/inquiry-rate-limit.js";

test("production config remains strict and enabled", () => {
  const config = getInquiryRateLimitConfig({ NODE_ENV: "production" });
  assert.equal(config.enabled, true);
  assert.equal(config.maxRequests, 5);
  assert.equal(config.windowMs, 15 * 60 * 1000);
});

test("development config uses relaxed defaults", () => {
  const config = getInquiryRateLimitConfig({ NODE_ENV: "development" });
  assert.equal(config.enabled, true);
  assert.equal(config.maxRequests, 100);
  assert.equal(config.windowMs, 60 * 1000);
});

test("development bypass can be enabled only by server env", () => {
  const config = getInquiryRateLimitConfig({
    NODE_ENV: "development",
    INQUIRY_DEV_RATE_LIMIT_MODE: "bypass",
  });
  assert.equal(config.enabled, false);
});

test("limiter blocks after configured threshold when enabled", () => {
  const limiter = createInquiryRateLimiter({ enabled: true, maxRequests: 2, windowMs: 60000 });
  assert.equal(limiter.isRateLimited("127.0.0.1"), false);
  assert.equal(limiter.isRateLimited("127.0.0.1"), false);
  assert.equal(limiter.isRateLimited("127.0.0.1"), true);
});

test("limiter does not block when disabled", () => {
  const limiter = createInquiryRateLimiter({ enabled: false, maxRequests: 1, windowMs: 1 });
  assert.equal(limiter.isRateLimited("127.0.0.1"), false);
  assert.equal(limiter.isRateLimited("127.0.0.1"), false);
  assert.equal(limiter.isRateLimited("127.0.0.1"), false);
});
