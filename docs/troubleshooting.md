# Troubleshooting Connection Leaks

Common causes of connection leaks in serverless runtimes:
1. Unhandled promise rejections before closing cursors.
2. Opening a new `MongoClient` on every request instead of caching the client across function invocations.
3. Heavy background tasks holding connections past the lambda timeout.
