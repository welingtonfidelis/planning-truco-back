"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const health_1 = require("./routes/health");
const room_1 = require("./routes/room");
const router = (0, express_1.Router)();
exports.router = router;
// NO AUTHENTICATED ROUTES
router.use(health_1.healthRouter);
router.use(room_1.roomRouter);
// AUTHENTICATED ROUTES
// ERROR HANDLER
router.use((error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.code) || 500;
    const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || "Internal server error";
    res.status(statusCode).json({ message: errorMessage });
});
//# sourceMappingURL=route.js.map