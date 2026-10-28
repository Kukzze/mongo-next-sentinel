# Benchmark Results

Mongo Next Sentinel introduces negligible overhead to the standard MongoDB connection lifecycle:

| Metric | Raw Driver | Driver + Sentinel | Overhead |
|---|---|---|---|
| Checkout Latency (p50) | 0.042 ms | 0.044 ms | +0.002 ms |
| Checkout Latency (p99) | 0.180 ms | 0.185 ms | +0.005 ms |
| Memory Footprint (10k conns) | 12.4 MB | 13.1 MB | +0.7 MB |
