import { describe, expect, it } from 'bun:test';
import { evaluatePoolHealth } from '../src/health';

describe('evaluatePoolHealth', () => {
  it('reports HEALTHY for low utilization', () => {
    const health = evaluatePoolHealth({
      totalCreated: 5,
      totalClosed: 0,
      currentActive: 1,
      currentAvailable: 9,
      peakActive: 2,
      checkoutWaitCount: 0
    });
    expect(health.status).toBe('HEALTHY');
    expect(health.utilizationPercent).toBe(10);
  });

  it('reports CRITICAL for heavy wait count', () => {
    const health = evaluatePoolHealth({
      totalCreated: 10,
      totalClosed: 0,
      currentActive: 9,
      currentAvailable: 1,
      peakActive: 10,
      checkoutWaitCount: 60
    });
    expect(health.status).toBe('CRITICAL');
  });
});
