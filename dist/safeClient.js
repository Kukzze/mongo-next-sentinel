"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeMongoClient = getSafeMongoClient;
const mongodb_1 = require("mongodb");
const sentinel_1 = require("./sentinel");
const globalWithMongo = globalThis;
/**
 * Returns a cached, connection-pooled MongoClient tailored for Next.js Server Actions,
 * Route Handlers, and Edge/Serverless runtimes.
 *
 * Prevents connection storming and Atlas pool exhaustion across hot-reloads and concurrent requests.
 */
function getSafeMongoClient(uri, options = {}) {
    if (process.env.NODE_ENV === 'development') {
        if (!globalWithMongo._mongoSentinelClientPromise) {
            const client = new mongodb_1.MongoClient(uri, {
                maxPoolSize: 10,
                minPoolSize: 1,
                maxIdleTimeMS: 30000,
                ...options.clientOptions,
            });
            const sentinel = new sentinel_1.MongoSentinel(client, options.sentinelConfig);
            globalWithMongo._mongoSentinelInstance = sentinel;
            globalWithMongo._mongoSentinelClientPromise = client.connect();
        }
        return {
            clientPromise: globalWithMongo._mongoSentinelClientPromise,
            sentinel: globalWithMongo._mongoSentinelInstance,
        };
    }
    // Production environment: per-worker singleton
    const client = new mongodb_1.MongoClient(uri, {
        maxPoolSize: 20,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
        ...options.clientOptions,
    });
    const sentinel = new sentinel_1.MongoSentinel(client, options.sentinelConfig);
    const clientPromise = client.connect();
    return { clientPromise, sentinel };
}
//# sourceMappingURL=safeClient.js.map