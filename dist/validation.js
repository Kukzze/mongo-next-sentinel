"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConnectionString = validateConnectionString;
function validateConnectionString(uri) {
    return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
}
//# sourceMappingURL=validation.js.map