# Benchmark Reproduction Harness

This suite benchmarks connection checkout overhead, pool thrashing behavior, and telemetry latency under sustained high concurrency.

## Test Matrix

| Benchmark Script | Focus Area | Target Workload |
|---|---|---|
| `concurrent-connections.ts` | High concurrency pool saturation | 1,000+ simultaneous checkout requests |
| `memory.ts` | Long-running heap & RSS stability | Sustained connection cycling across 10,000 iterations |
| `pool.bench.ts` | Micro-benchmarks for CMAP hooks | Sub-millisecond checkout and release latency |
| `throughput.ts` | End-to-end driver operations | CRUD request throughput with active Sentinel tracking |

## Executing the Harness

Ensure you have a local or containerized MongoDB instance running:

```bash
docker run -d -p 27017:27017 --name mongo-sentinel-bench mongo:7.0
```

Run benchmarks via Bun or Node:

```bash
# Run microbenchmarks
bun run benchmarks/pool.bench.ts

# Run concurrency endurance test
bun run benchmarks/concurrent-connections.ts
```
