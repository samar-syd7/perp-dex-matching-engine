import { FastifyRequest, FastifyReply } from "fastify";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const CAPACITY = 10;          // max burst
const REFILL_RATE = 5;        // tokens per second

export function rateLimiter(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  const ip = request.ip;

  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: now,
    };
    buckets.set(ip, bucket);
  }

  /**
   * Refill tokens based on elapsed time
   */
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refill = elapsed * REFILL_RATE;

  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
  bucket.lastRefill = now;

  /**
   * Consume token
   */
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    done();
  } else {
    reply.status(429).send({
      error: "Rate limit exceeded",
    });
  }
}