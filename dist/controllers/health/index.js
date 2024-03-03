"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
exports.healthController = {
    healthCheck(req, res) {
        const version = 1; //TODO get package version
        return res.json({ server_on: true, version });
    },
};
//# sourceMappingURL=index.js.map