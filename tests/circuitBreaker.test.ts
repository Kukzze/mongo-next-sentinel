import { describe, expect, it } from 'bun:test';
import { CircuitBreaker } from '../src/circuitBreaker';

describe('CircuitBreaker', () => {
  it('starts in CLOSED state and allows execution', () => {
    const cb = new CircuitBreaker();
    expect(cb.getState()).toBe('CLOSED');
    expect(cb.canExecute()).toBe(true);
  });

  it('trips to OPEN when failures exceed threshold', () => {
    const cb = new CircuitBreaker({ failureThreshold: 2 });
    cb.recordFailure();
    expect(cb.canExecute()).toBe(true);
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
    expect(cb.canExecute()).toBe(false);
  });
});
