import { describe, expect, it } from 'bun:test';
import { SentinelLogger } from '../src/logger';

describe('SentinelLogger', () => {
  it('instantiates cleanly in both text and JSON modes', () => {
    const textLogger = new SentinelLogger(false);
    const jsonLogger = new SentinelLogger(true);
    expect(textLogger).toBeDefined();
    expect(jsonLogger).toBeDefined();
  });
});
