"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskMongoUri = maskMongoUri;
function maskMongoUri(uri) {
    try {
        return uri.replace(/(:)([^@/]+)(@)/, '$1*****$3');
    }
    catch {
        return '[REDACTED_URI]';
    }
}
//# sourceMappingURL=sanitizer.js.map