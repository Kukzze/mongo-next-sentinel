import { describe, expect, it } from 'bun:test';
import { createDiagnosticSnapshot } from '../src/snapshot';

describe('createDiagnosticSnapshot', () => {
  it('generates immutable snapshot', () => {
    const metrics = { totalCreated: 1, totalClosed: 0, currentActive: 1, currentAvailable: 0, peakActive: 1, checkoutWaitCount: 0 };
    const snap = createDiagnosticSnapshot(metrics, 1);
    expect(snap.version).toBe('1.1.0');
    expect(snap.activeCheckoutsCount).toBe(1);
  });
});
