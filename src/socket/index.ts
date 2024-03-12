import socketIo from "socket.io";
import isNil from "lodash/isNil";
import isString from "lodash/isString";
import { roomService } from "../services/room";
import { KnownErrors } from "../shared/const/knownErrors";
import { SocketEvents } from "../shared/enum/socketEvents";
import { Task } from "../domain/task";
import { User } from "../domain/user";

const { INVALID_ROOM, MISSING_ROOM, INVALID_CREATE_USER } = KnownErrors;

const {
  findRoomByIdService,
  addUserToRoomService,
  deleteUserFromRoomService,
  addTaskToRoomService,
  deleteTaskFromRoomService,
  updateCurrentTaskService,
  updateUserVoteService,
  updateShowVotesService,
  resetVotesService,
  updateUserProfileService,
  updateOwnerRoomService,
} = roomService;

const {
  CONNECTION,
  DISCONNECT,
  EXCEPTION,
  SERVER_ROOM_DATA,
  SERVER_ROOM_NEW_USER,
  SERVER_ROOM_USER_LOGOUT,
  SERVER_ROOM_NEW_USER_OWN,
  SERVER_ROOM_NEW_TASK,
  SERVER_ROOM_DELETE_TASK,
  CLIENT_ROOM_DELETE_TASK,
  CLIENT_ROOM_NEW_TASK,
  SERVER_ROOM_SELECT_VOTING_TASK,
  CLIENT_ROOM_SELECT_VOTING_TASK,
  SERVER_ROOM_VOTE_TASK,
  CLIENT_ROOM_VOTE_TASK,
  SERVER_ROOM_SHOW_VOTES,
  CLIENT_ROOM_SHOW_VOTES,
  SERVER_ROOM_RESET_VOTES,
  CLIENT_ROOM_RESET_VOTES,
  SERVER_USER_UPDATE_PROFILE,
  CLIENT_USER_UPDATE_PROFILE,
  CLIENT_KICK_USER,
  SERVER_KICK_USER,
  CLIENT_OWNER_ROOM_TRANSFER,
  SERVER_OWNER_ROOM_TRANSFER,
} = SocketEvents;

export const socketListener = (socketServer: socketIo.Server) => {
  socketServer.on(CONNECTION, (socket) => {
    const userName = socket.handshake.query.userName as string;
    const roomId = socket.handshake.query.roomId as string;

    // EXCEPTIONS
    if (isNil(roomId)) {
      socket.emit(EXCEPTION, MISSING_ROOM);
      socket.disconnect();
    }

    const roomExists = findRoomByIdService(roomId);

    if (!isString(roomId) || !roomExists) {
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
      name: userName as string,
      vote: null,
    };
    const room = addUserToRoomService(roomId, newUser);

    socket.join(roomId);
    socket.emit(SERVER_ROOM_DATA, room);
    socket.to(roomId).emit(SERVER_ROOM_NEW_USER, newUser);

    // USERS
    socket.on(CLIENT_USER_UPDATE_PROFILE, (data: Partial<User>) => {
      const { id: userId, ...profileData } = data;

      if (!userId) return;

      updateUserProfileService(roomId, userId, profileData);

      socket.nsp
        .to(roomId)
        .emit(SERVER_USER_UPDATE_PROFILE, { userId, profileData });
    });

    socket.on(CLIENT_KICK_USER, (data: string) => {
      // socket.in(data).disconnectSockets(); //force socket user disconnect
      deleteUserFromRoomService(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_KICK_USER, data);
      socket.in(data).socketsLeave(roomId);
    });

    socket.on(CLIENT_OWNER_ROOM_TRANSFER, (data: string) => {
      updateOwnerRoomService(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_OWNER_ROOM_TRANSFER, data);
    });

    // TASKS
    socket.on(CLIENT_ROOM_NEW_TASK, (data: Task) => {
      const newTask = addTaskToRoomService(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_ROOM_NEW_TASK, newTask);
    });

    socket.on(CLIENT_ROOM_DELETE_TASK, (data: string) => {
      deleteTaskFromRoomService(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_ROOM_DELETE_TASK, data);
    });

    socket.on(CLIENT_ROOM_SELECT_VOTING_TASK, (data: string) => {
      updateCurrentTaskService(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_ROOM_SELECT_VOTING_TASK, data);
    });

    // VOTES
    socket.on(CLIENT_ROOM_VOTE_TASK, (data: string) => {
      const room = findRoomByIdService(roomId);

      if (room.showVotes || !room.currentTaskId) return;

      updateUserVoteService(roomId, socket.id, data);

      socket.nsp
        .to(roomId)
        .emit(SERVER_ROOM_VOTE_TASK, { userId: socket.id, vote: data });
    });

    socket.on(CLIENT_ROOM_SHOW_VOTES, () => {
      const room = findRoomByIdService(roomId);

      if (!room.currentTaskId) return;

      const { points } = updateShowVotesService(roomId);

      socket.nsp.to(roomId).emit(SERVER_ROOM_SHOW_VOTES, { points });
    });

    socket.on(CLIENT_ROOM_RESET_VOTES, () => {
      const room = findRoomByIdService(roomId);

      if (!room.currentTaskId) return;

      const { points } = resetVotesService(roomId);

      socket.nsp.to(roomId).emit(SERVER_ROOM_RESET_VOTES, { points });
    });

    // LOGOUT
    socket.on(DISCONNECT, () => {
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
