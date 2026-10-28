import { describe, expect, it } from 'bun:test';
import { ConnectionLeakError, CircuitBreakerOpenError } from '../src/errors';

describe('Errors', () => {
  it('instantiates ConnectionLeakError with duration', () => {
    const err = new ConnectionLeakError(1, 6000);
    expect(err.message).toContain('leaked after 6000ms');
    expect(err.name).toBe('ConnectionLeakError');
  });
  it('instantiates CircuitBreakerOpenError', () => {
    const err = new CircuitBreakerOpenError();
    expect(err.message).toContain('Circuit breaker is OPEN');
  });
});
