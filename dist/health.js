"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePoolHealth = evaluatePoolHealth;
function evaluatePoolHealth(metrics, maxPoolSize = 100) {
    const total = metrics.currentActive + metrics.currentAvailable;
    const utilization = total > 0 ? (metrics.currentActive / total) * 100 : 0;
    let status = 'HEALTHY';
    if (utilization > 90 || metrics.checkoutWaitCount > 50) {
        status = 'CRITICAL';
    }
    else if (utilization > 70 || metrics.checkoutWaitCount > 10) {
        status = 'DEGRADED';
    }
    return {
        status,
        utilizationPercent: Math.round(utilization),
        activeCount: metrics.currentActive,
        availableCount: metrics.currentAvailable
    };
}
//# sourceMappingURL=health.js.map