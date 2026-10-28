import { describe, expect, it } from 'bun:test';
import { formatPrometheusMetrics } from '../src/prometheus';

describe('formatPrometheusMetrics', () => {
  it('formats pool metrics into Prometheus text format', () => {
    const res = formatPrometheusMetrics({
      totalCreated: 10,
      totalClosed: 2,
      currentActive: 3,
      currentAvailable: 5,
      peakActive: 8,
      checkoutWaitCount: 15
    });
    expect(res).toContain('mongo_sentinel_total_connections_created 10');
    expect(res).toContain('mongo_sentinel_active_connections 3');
  });
});
