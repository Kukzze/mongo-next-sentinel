import { describe, expect, it } from 'bun:test';
import { getSafeMongoClient } from '../src/safeClient';

describe('getSafeMongoClient', () => {
  it('instantiates a MongoClient with default pool parameters', async () => {
    const { clientPromise, sentinel } = getSafeMongoClient(
      'mongodb://localhost:27017/test_db',
      {
        clientOptions: {
          maxPoolSize: 25,
          minPoolSize: 5,
          serverSelectionTimeoutMS: 500,
        },
        sentinelConfig: {
          leakThresholdMs: 1500,
          enableConsoleWarnings: false,
        },
      }
    );

    expect(clientPromise).toBeDefined();
    expect(sentinel).toBeDefined();
    expect(sentinel?.getConfig().leakThresholdMs).toBe(1500);
  });

  it('reuses the client singleton in development environments', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const first = getSafeMongoClient(
      'mongodb://localhost:27017/test_cache_db',
      {
        clientOptions: { maxPoolSize: 10, serverSelectionTimeoutMS: 500 },
        sentinelConfig: { enableConsoleWarnings: false },
      }
    );

    const second = getSafeMongoClient(
      'mongodb://localhost:27017/test_cache_db',
      {
        clientOptions: { maxPoolSize: 10, serverSelectionTimeoutMS: 500 },
        sentinelConfig: { enableConsoleWarnings: false },
      }
    );

    expect(first.clientPromise).toBe(second.clientPromise);
    expect(first.sentinel).toBe(second.sentinel);

    process.env.NODE_ENV = origEnv;
  });
});
