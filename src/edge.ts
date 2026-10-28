export function isEdgeRuntime(): boolean {
  return typeof (globalThis as any).EdgeRuntime === 'string';
}

export function assertNodeOrEdge(environmentName = 'MongoSentinel'): void {
  if (typeof process === 'undefined' && !isEdgeRuntime()) {
    console.warn('[' + environmentName + ':WARN] Unsupported runtime detected; connection tracking may be degraded.');
  }
}
