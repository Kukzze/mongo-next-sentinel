export function maskMongoUri(uri: string): string {
  try {
    return uri.replace(/(:)([^@/]+)(@)/, '$1*****$3');
  } catch {
    return '[REDACTED_URI]';
  }
}
