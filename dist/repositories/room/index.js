"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRepository = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const rooms = {};
exports.roomRepository = {
    findById(id) {
        return rooms[id];
    },
    addRoom(id) {
        return (rooms[id] = {
            id,
            currentTaskId: "",
            ownerUserId: "",
            showVotes: false,
            tasks: [],
            users: [],
        });
    },
    updateRoom(roomId, data) {
        return (rooms[roomId] = Object.assign(Object.assign({}, rooms[roomId]), data));
    },
    deleteRoom(id) {
        return delete rooms[id];
    },
    addUserToRoom(roomId, user) {
        var _a, _b;
        if ((0, isNil_1.default)(rooms[roomId]))
            return;
        if ((0, isEmpty_1.default)((_a = rooms[roomId]) === null || _a === void 0 ? void 0 : _a.ownerUserId) ||
            (0, isNil_1.default)((_b = rooms[roomId]) === null || _b === void 0 ? void 0 : _b.ownerUserId)) {
            rooms[roomId].ownerUserId = user.id;
        }
        rooms[roomId].users.push(user);
        return rooms[roomId];
    },
    deleteUserFromRoom(roomId, userId) {
        rooms[roomId].users = rooms[roomId].users.filter((user) => user.id !== userId);
        if (!rooms[roomId].users.length) {
            delete rooms[roomId];
            return;
        }
        rooms[roomId].ownerUserId = rooms[roomId].users[0].id;
        return rooms[roomId];
    },
    addTaskToRoom(roomId, task) {
        if ((0, isNil_1.default)(rooms[roomId]))
            return;
        rooms[roomId].tasks.push(task);
        return task;
    },
    deleteTaskFromRoom(roomId, taskId) {
        rooms[roomId].tasks = rooms[roomId].tasks.filter((task) => task.id !== taskId);
        if (rooms[roomId].currentTaskId === taskId) {
            rooms[roomId].currentTaskId = "";
            rooms[roomId].users = rooms[roomId].users.map((user) => (Object.assign(Object.assign({}, user), { vote: null })));
        }
        return rooms[roomId];
    },
    updateUserVote(roomId, userId, vote) {
        const updatedUsers = rooms[roomId].users.map((user) => {
            if (user.id === userId) {
                return Object.assign(Object.assign({}, user), { vote });
            }
            return user;
        });
        rooms[roomId].users = updatedUsers;
        return rooms[roomId];
    },
};
//# sourceMappingURL=index.js.map