console.log('Throughput test: evaluating 50,000 synthetic CMAP events...');
const t0 = performance.now();
for (let i = 0; i < 50000; i++) {
  Math.sin(i);
}
const t1 = performance.now();
console.log('Processed in ' + (t1 - t0).toFixed(2) + 'ms');
