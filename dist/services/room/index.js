"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = void 0;
const crypto_1 = require("crypto");
const room_1 = require("../../repositories/room");
const jokerCardValue_1 = require("../../shared/const/jokerCardValue");
const isNil_1 = __importDefault(require("lodash/isNil"));
const { findById, addRoom, deleteRoom, addUserToRoom, deleteUserFromRoom, addTaskToRoom, deleteTaskFromRoom, updateRoom, updateUserVote, } = room_1.roomRepository;
exports.roomService = {
    findRoomByIdService(id) {
        return findById(id);
    },
    addRoomService() {
        const id = (0, crypto_1.randomUUID)();
        return addRoom(id);
    },
    deleteRoomService(id) {
        return deleteRoom(id);
    },
    updateRoomService(roomId, room) {
        return updateRoom(roomId, room);
    },
    addUserToRoomService(roomId, user) {
        return addUserToRoom(roomId, user);
    },
    deleteUserFromRoomService(roomId, userId) {
        return deleteUserFromRoom(roomId, userId);
    },
    addTaskToRoomService(roomId, task) {
        task.id = (0, crypto_1.randomUUID)();
        return addTaskToRoom(roomId, task);
    },
    deleteTaskFromRoomService(roomId, taskId) {
        return deleteTaskFromRoom(roomId, taskId);
    },
    updateUserVoteService(roomId, userId, vote) {
        return updateUserVote(roomId, userId, vote);
    },
    updateCurrentTaskService(roomId, taskId) {
        const { users } = findById(roomId);
        const updatedUsers = users.map((user) => (Object.assign(Object.assign({}, user), { vote: null })));
        return updateRoom(roomId, {
            users: updatedUsers,
            currentTaskId: taskId,
            showVotes: false,
        });
    },
    updateShowVotesService(roomId) {
        const { currentTaskId, tasks, users } = findById(roomId);
        const totalVotes = users.reduce((acc, user) => {
            if ((0, isNil_1.default)(user.vote) || jokerCardValue_1.JokerCardValue.includes(user.vote))
                return acc;
            return (acc += user.vote);
        }, 0);
        const averageVotes = totalVotes / users.length;
        const updatedTasks = tasks.map((task) => {
            if (task.id === currentTaskId)
                return Object.assign(Object.assign({}, task), { points: averageVotes });
            return task;
        });
        updateRoom(roomId, { tasks: updatedTasks, showVotes: true });
        return { currentTaskId, points: averageVotes };
    },
    resetVotesService(roomId) {
        const { currentTaskId, tasks, users } = findById(roomId);
        const updatedUsers = users.map((user) => (Object.assign(Object.assign({}, user), { vote: null })));
        const updatedTasks = tasks.map((task) => {
            if (task.id === currentTaskId)
                return Object.assign(Object.assign({}, task), { points: 0 });
            return task;
        });
        updateRoom(roomId, {
            users: updatedUsers,
            tasks: updatedTasks,
            showVotes: false,
        });
        return { currentTaskId, points: 0 };
    },
    updateUserProfile(roomId, userId, data) {
        const { users } = findById(roomId);
        const updatedUsers = users.map((user) => {
            if (user.id === userId) {
                return Object.assign(Object.assign({}, user), data);
            }
            return user;
        });
        return updateRoom(roomId, { users: updatedUsers });
    },
};
//# sourceMappingURL=index.js.map