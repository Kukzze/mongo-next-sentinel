"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiagnosticSnapshot = createDiagnosticSnapshot;
function createDiagnosticSnapshot(metrics, activeCount) {
    return {
        timestamp: new Date().toISOString(),
        version: '1.1.0',
        metrics: { ...metrics },
        activeCheckoutsCount: activeCount
    };
}
//# sourceMappingURL=snapshot.js.map