import { MongoClient, type MongoClientOptions } from 'mongodb';
import { MongoSentinel } from './sentinel';
import type { SentinelConfig } from './types';
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
export declare function getSafeMongoClient(uri: string, options?: SafeClientOptions): {
    clientPromise: Promise<MongoClient>;
    sentinel?: MongoSentinel;
};
//# sourceMappingURL=safeClient.d.ts.map