"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercentile = calculatePercentile;
function calculatePercentile(samples, percentile) {
    if (samples.length === 0)
        return 0;
    const sorted = [...samples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}
//# sourceMappingURL=stats.js.map