import { describe, expect, it } from 'bun:test';
import type { PoolEventType } from '../src/poolEvents';

describe('PoolEventType', () => {
  it('handles event type definition', () => {
    const eventType: PoolEventType = 'connectionCreated';
    expect(eventType).toBe('connectionCreated');
  });
});
