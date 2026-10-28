import { describe, expect, it } from 'bun:test';
import { maskMongoUri } from '../src/sanitizer';

describe('maskMongoUri', () => {
  it('masks sensitive password in MongoDB connection string', () => {
    const uri = 'mongodb+srv://admin:superSecret123@cluster0.mongodb.net/prod';
    expect(maskMongoUri(uri)).toBe('mongodb+srv://admin:*****@cluster0.mongodb.net/prod');
  });
});
