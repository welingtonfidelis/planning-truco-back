"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const route_1 = require("./route");
const config_1 = require("./config");
const socket_1 = require("./socket");
const { PORT, CORS_DOMAINS } = config_1.config;
const corsDomain = CORS_DOMAINS.split(",").map((item) => item.trim());
const corsOptions = {
    origin: corsDomain,
    optionsSuccessStatus: 200,
    credentials: true,
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(route_1.router);
const expressServer = app.listen(PORT, function () {
    console.log(`Server running in ${PORT}\n`);
});
const socketServer = new socket_io_1.default.Server(expressServer, {
    cors: { origin: corsDomain },
});
(0, socket_1.socketListener)(socketServer);
//# sourceMappingURL=server.js.map