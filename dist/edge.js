"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEdgeRuntime = isEdgeRuntime;
exports.assertNodeOrEdge = assertNodeOrEdge;
function isEdgeRuntime() {
    return typeof globalThis.EdgeRuntime === 'string';
}
function assertNodeOrEdge(environmentName = 'MongoSentinel') {
    if (typeof process === 'undefined' && !isEdgeRuntime()) {
        console.warn('[' + environmentName + ':WARN] Unsupported runtime detected; connection tracking may be degraded.');
    }
}
//# sourceMappingURL=edge.js.map