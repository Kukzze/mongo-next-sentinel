import { describe, expect, it } from 'bun:test';
import { calculatePercentile } from '../src/stats';

describe('calculatePercentile', () => {
  it('calculates p50 and p99 correctly', () => {
    const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(calculatePercentile(values, 50)).toBe(50);
    expect(calculatePercentile(values, 99)).toBe(100);
  });
});
