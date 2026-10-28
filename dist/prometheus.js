"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPrometheusMetrics = formatPrometheusMetrics;
function formatPrometheusMetrics(metrics, prefix = 'mongo_sentinel') {
    const lines = [
        '# HELP ' + prefix + '_total_connections_created Total connections created in pool',
        '# TYPE ' + prefix + '_total_connections_created counter',
        prefix + '_total_connections_created ' + metrics.totalCreated,
        '# HELP ' + prefix + '_total_connections_closed Total connections closed in pool',
        '# TYPE ' + prefix + '_total_connections_closed counter',
        prefix + '_total_connections_closed ' + metrics.totalClosed,
        '# HELP ' + prefix + '_active_connections Current active in-flight checkouts',
        '# TYPE ' + prefix + '_active_connections gauge',
        prefix + '_active_connections ' + metrics.currentActive,
        '# HELP ' + prefix + '_available_connections Current idle available connections',
        '# TYPE ' + prefix + '_available_connections gauge',
        prefix + '_available_connections ' + metrics.currentAvailable,
        '# HELP ' + prefix + '_peak_active_connections Historical peak active connections',
        '# TYPE ' + prefix + '_peak_active_connections gauge',
        prefix + '_peak_active_connections ' + metrics.peakActive,
        '# HELP ' + prefix + '_checkout_wait_count Total checkout requests queued',
        '# TYPE ' + prefix + '_checkout_wait_count counter',
        prefix + '_checkout_wait_count ' + metrics.checkoutWaitCount
    ];
    return lines.join('\n') + '\n';
}
//# sourceMappingURL=prometheus.js.map