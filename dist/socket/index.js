"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketListener = void 0;
const isNil_1 = __importDefault(require("lodash/isNil"));
const isString_1 = __importDefault(require("lodash/isString"));
const room_1 = require("../services/room");
const knownErrors_1 = require("../shared/const/knownErrors");
const socketEvents_1 = require("../shared/enum/socketEvents");
const { INVALID_ROOM, MISSING_ROOM, INVALID_CREATE_USER } = knownErrors_1.KnownErrors;
const { findRoomByIdService, addUserToRoomService, deleteUserFromRoomService, addTaskToRoomService, deleteTaskFromRoomService, updateCurrentTaskService, updateUserVoteService, updateShowVotesService, resetVotesService, updateUserProfile, } = room_1.roomService;
const { CONNECTION, DISCONNECTION, EXCEPTION, SERVER_ROOM_DATA, SERVER_ROOM_NEW_USER, SERVER_ROOM_USER_LOGOUT, SERVER_ROOM_NEW_USER_OWN, SERVER_ROOM_NEW_TASK, SERVER_ROOM_DELETE_TASK, CLIENT_ROOM_DELETE_TASK, CLIENT_ROOM_NEW_TASK, SERVER_ROOM_SELECT_VOTING_TASK, CLIENT_ROOM_SELECT_VOTING_TASK, SERVER_ROOM_VOTE_TASK, CLIENT_ROOM_VOTE_TASK, SERVER_ROOM_SHOW_VOTES, CLIENT_ROOM_SHOW_VOTES, SERVER_ROOM_RESET_VOTES, CLIENT_ROOM_RESET_VOTES, SERVER_USER_UPDATE_PROFILE, CLIENT_USER_UPDATE_PROFILE, } = socketEvents_1.SocketEvents;
const socketListener = (socketServer) => {
    socketServer.on(CONNECTION, (socket) => {
        const userName = socket.handshake.query.userName;
        const roomId = socket.handshake.query.roomId;
        // EXCEPTIONS
        if ((0, isNil_1.default)(roomId)) {
            socket.emit(EXCEPTION, MISSING_ROOM);
            socket.disconnect();
        }
        const roomExists = findRoomByIdService(roomId);
        if (!(0, isString_1.default)(roomId) || !roomExists) {
            socket.emit(EXCEPTION, INVALID_ROOM);
            socket.disconnect();
        }
        if (!userName) {
            socket.emit(EXCEPTION, INVALID_CREATE_USER);
            socket.disconnect();
        }
        // FIRST USER CONNECTION
        const newUser = {
            id: socket.id,
            name: userName,
            vote: null,
        };
        const room = addUserToRoomService(roomId, newUser);
        socket.join(roomId);
        socket.emit(SERVER_ROOM_DATA, room);
        socket.to(roomId).emit(SERVER_ROOM_NEW_USER, newUser);
        // USERS
        socket.on(CLIENT_USER_UPDATE_PROFILE, (data) => {
            const { id: userId } = data, profileData = __rest(data, ["id"]);
            if (!userId)
                return;
            updateUserProfile(roomId, userId, profileData);
            socket.nsp
                .to(roomId)
                .emit(SERVER_USER_UPDATE_PROFILE, { userId, profileData });
        });
        // TASKS
        socket.on(CLIENT_ROOM_NEW_TASK, (data) => {
            const newTask = addTaskToRoomService(roomId, data);
            socket.nsp.to(roomId).emit(SERVER_ROOM_NEW_TASK, newTask);
        });
        socket.on(CLIENT_ROOM_DELETE_TASK, (data) => {
            deleteTaskFromRoomService(roomId, data);
            socket.nsp.to(roomId).emit(SERVER_ROOM_DELETE_TASK, data);
        });
        socket.on(CLIENT_ROOM_SELECT_VOTING_TASK, (data) => {
            updateCurrentTaskService(roomId, data);
            socket.nsp.to(roomId).emit(SERVER_ROOM_SELECT_VOTING_TASK, data);
        });
        // VOTES
        socket.on(CLIENT_ROOM_VOTE_TASK, (data) => {
            const room = findRoomByIdService(roomId);
            if (room.showVotes || !room.currentTaskId)
                return;
            updateUserVoteService(roomId, socket.id, data);
            socket.nsp
                .to(roomId)
                .emit(SERVER_ROOM_VOTE_TASK, { userId: socket.id, vote: data });
        });
        socket.on(CLIENT_ROOM_SHOW_VOTES, () => {
            const room = findRoomByIdService(roomId);
            if (!room.currentTaskId)
                return;
            const { points } = updateShowVotesService(roomId);
            socket.nsp
                .to(roomId)
                .emit(SERVER_ROOM_SHOW_VOTES, { points });
        });
        socket.on(CLIENT_ROOM_RESET_VOTES, () => {
            const room = findRoomByIdService(roomId);
            if (!room.currentTaskId)
                return;
            const { points } = resetVotesService(roomId);
            socket.nsp
                .to(roomId)
                .emit(SERVER_ROOM_RESET_VOTES, { points });
        });
        // LOGOUT
        socket.on(DISCONNECTION, () => {
            const updatedRoom = deleteUserFromRoomService(roomId, socket.id);
            socket.to(roomId).emit(SERVER_ROOM_USER_LOGOUT, socket.id);
            socket.leave(roomId);
            if (updatedRoom)
                socket
                    .to(roomId)
                    .emit(SERVER_ROOM_NEW_USER_OWN, updatedRoom.ownerUserId);
        });
    });
};
exports.socketListener = socketListener;
//# sourceMappingURL=index.js.map