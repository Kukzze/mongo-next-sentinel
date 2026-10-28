import { describe, expect, it } from 'bun:test';
import { validateConnectionString } from '../src/validation';

describe('validateConnectionString', () => {
  it('accepts mongodb and mongodb+srv schemes', () => {
    expect(validateConnectionString('mongodb://localhost:27017')).toBe(true);
    expect(validateConnectionString('mongodb+srv://cluster.mongodb.net')).toBe(true);
    expect(validateConnectionString('http://localhost')).toBe(false);
  });
});
