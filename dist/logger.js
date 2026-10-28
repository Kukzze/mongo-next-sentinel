"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentinelLogger = void 0;
class SentinelLogger {
    jsonMode;
    constructor(jsonMode = false) {
        this.jsonMode = jsonMode;
    }
    log(level, message, meta) {
        if (this.jsonMode) {
            const payload = {
                level,
                message,
                timestamp: new Date().toISOString(),
                meta
            };
            console[level](JSON.stringify(payload));
        }
        else {
            console[level]('[MongoSentinel:' + level.toUpperCase() + '] ' + message, meta ?? '');
        }
    }
}
exports.SentinelLogger = SentinelLogger;
//# sourceMappingURL=logger.js.map