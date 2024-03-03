"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomController = void 0;
const room_1 = require("../../services/room");
const { addRoomService } = room_1.roomService;
exports.roomController = {
    create(req, res) {
        const room = addRoomService();
        return res.json({ id: room.id });
    },
};
//# sourceMappingURL=index.js.map