import { MongoSentinel } from '../src/sentinel';

console.log('Running benchmark baseline for MongoSentinel instantiation...');
const start = performance.now();
for (let i = 0; i < 1000; i++) {
  const s = new MongoSentinel({ on: () => {} } as any);
}
const end = performance.now();
console.log('1000 instances created in ' + (end - start).toFixed(2) + 'ms');
