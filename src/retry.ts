export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxRetries = options.retries ?? 3;
  const baseDelay = options.baseDelayMs ?? 100;
  const maxDelay = options.maxDelayMs ?? 2000;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 50, maxDelay);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}
