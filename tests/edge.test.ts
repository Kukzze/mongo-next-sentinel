import { describe, expect, it } from 'bun:test';
import { isEdgeRuntime, assertNodeOrEdge } from '../src/edge';

describe('Edge Runtime Checks', () => {
  it('detects standard non-edge Node/Bun runtime', () => {
    expect(isEdgeRuntime()).toBe(false);
  });

  it('runs assertNodeOrEdge without throwing', () => {
    expect(() => assertNodeOrEdge()).not.toThrow();
  });
});
