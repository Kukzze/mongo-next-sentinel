import { describe, expect, it } from 'bun:test';
import { withRetry } from '../src/retry';

describe('withRetry', () => {
  it('returns immediately on success', async () => {
    const res = await withRetry(async () => 'success');
    expect(res).toBe('success');
  });
  it('retries upon intermittent failure and succeeds', async () => {
    let count = 0;
    const res = await withRetry(async () => {
      count++;
      if (count < 2) throw new Error('fail');
      return 'recovered';
    }, { baseDelayMs: 5 });
    expect(res).toBe('recovered');
    expect(count).toBe(2);
  });
});
