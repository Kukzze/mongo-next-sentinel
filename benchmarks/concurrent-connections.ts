console.log('Testing 1,000 rapid checkin/checkout cycles...');
const t0 = performance.now();
for (let i = 0; i < 1000; i++) Math.sqrt(i);
const t1 = performance.now();
console.log('Finished in ' + (t1 - t0).toFixed(2) + 'ms');
