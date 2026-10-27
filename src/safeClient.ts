import { MongoClient, type MongoClientOptions } from 'mongodb';
import { MongoSentinel } from './sentinel';
import type { SentinelConfig } from './types';

const globalWithMongo = globalThis as unknown as {
  _mongoSentinelClientPromise?: Promise<MongoClient>;
  _mongoSentinelInstance?: MongoSentinel;
};

export interface SafeClientOptions {
  clientOptions?: MongoClientOptions;
  sentinelConfig?: SentinelConfig;
}

/**
 * Returns a cached, connection-pooled MongoClient tailored for Next.js Server Actions,
 * Route Handlers, and Edge/Serverless runtimes.
 *
 * Prevents connection storming and Atlas pool exhaustion across hot-reloads and concurrent requests.
 */
export function getSafeMongoClient(
  uri: string,
  options: SafeClientOptions = {}
): { clientPromise: Promise<MongoClient>; sentinel?: MongoSentinel } {
  if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoSentinelClientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        ...options.clientOptions,
      } as MongoClientOptions);

      const sentinel = new MongoSentinel(client, options.sentinelConfig);
      globalWithMongo._mongoSentinelInstance = sentinel;
      globalWithMongo._mongoSentinelClientPromise = client.connect();
    }
    return {
      clientPromise: globalWithMongo._mongoSentinelClientPromise,
      sentinel: globalWithMongo._mongoSentinelInstance,
    };
  }

  // Production environment: per-worker singleton
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    ...options.clientOptions,
  } as MongoClientOptions);

  const sentinel = new MongoSentinel(client, options.sentinelConfig);
  const clientPromise = client.connect();

  return { clientPromise, sentinel };
}
