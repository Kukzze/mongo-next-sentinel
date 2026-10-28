import { describe, expect, it } from 'bun:test';
import { MongoSentinel } from '../src/sentinel';

describe('Concurrent Mock Activity', () => {
  it('handles burst of connection checkouts cleanly', () => {
    const listeners: Record<string, Function> = {};
    const mockClient = {
      on: (event: string, cb: Function) => { listeners[event] = cb; }
    };
    const sentinel = new MongoSentinel(mockClient as any);
    for (let i = 1; i <= 20; i++) {
      listeners['connectionCheckedOut']?.({ connectionId: i });
    }
    const metrics = sentinel.getMetrics();
    expect(metrics.currentActive).toBe(20);
    expect(metrics.peakActive).toBe(20);
  });
});
