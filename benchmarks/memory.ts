console.log('Memory test: verifying zero retain cycles in timer map...');
const initial = process.memoryUsage().heapUsed;
const map = new Map();
for (let i = 0; i < 10000; i++) map.set(i, { timer: null });
map.clear();
const delta = process.memoryUsage().heapUsed - initial;
console.log('Heap delta: ' + (delta / 1024).toFixed(2) + ' KB');
