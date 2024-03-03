"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const express_1 = require("express");
const room_1 = require("../../controllers/room");
const createRoom_1 = require("./midleware/requestPayloadValidate/createRoom");
const roomRouter = (0, express_1.Router)();
exports.roomRouter = roomRouter;
roomRouter.post("/rooms", createRoom_1.validateCreateRoomSchema, room_1.roomController.create);
//# sourceMappingURL=index.js.map