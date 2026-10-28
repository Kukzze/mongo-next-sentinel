# High-Throughput Performance Tuning

1. Tune `maxIdleTimeMS` to clean up stale socket connections.
2. Keep `minPoolSize` at 1-2 for warm serverless instances.
3. Minimize connection creation latency with DNS caching.
