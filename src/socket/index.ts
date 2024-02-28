import socketIo from "socket.io";
import { roomService } from "../services/room";
import { KnownErrors } from "../shared/enum/knownErrors";
import isNil from "lodash/isNil";
import isString from "lodash/isString";
import { SocketEvents } from "../shared/enum/socketEvents";
import { Task } from "../domain/task";

const { INVALID_ROOM, MISSING_ROOM, INVALID_CREATE_USER } = KnownErrors;

const {
  findRoomByIdService,
  addUserToRoomService,
  deleteUserFromRoomService,
  addTaskToRoomService,
  deleteTaskFromRoomService,
  updateRoomService,
  updateUserVoteService,
  updateShowVotes,
} = roomService;

const {
  CONNECTION,
  DISCONNECTION,
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
  SERVER_ROOM_SHOW_HIDE_VOTES,
  CLIENT_ROOM_SHOW_HIDE_VOTES,
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
      updateRoomService(roomId, { currentTaskId: data });

      socket.nsp.to(roomId).emit(SERVER_ROOM_SELECT_VOTING_TASK, data);
    });

    // VOTES
    socket.on(CLIENT_ROOM_VOTE_TASK, (data: number) => {
      const room = findRoomByIdService(roomId);

      if (room.showVotes || !room.currentTaskId) return;

      updateUserVoteService(roomId, socket.id, data);

      socket.nsp.to(roomId).emit(SERVER_ROOM_VOTE_TASK, { userId: socket.id, vote: data});
    });

    socket.on(CLIENT_ROOM_SHOW_HIDE_VOTES, (data: boolean) => {
      const room = findRoomByIdService(roomId);

      if (!room.currentTaskId) return;

      const { tasks, users } = updateShowVotes(roomId, data);

      socket.nsp.to(roomId).emit(SERVER_ROOM_SHOW_HIDE_VOTES, { tasks, users, showVotes: data });
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

    const newUser = {
      id: socket.id,
      name: userName as string,
      vote: null,
    };
    const room = addUserToRoomService(roomId, newUser);

    socket.join(roomId);
    socket.emit(SERVER_ROOM_DATA, room);
    socket.to(roomId).emit(SERVER_ROOM_NEW_USER, newUser);
  });
};

// io.on('connection', (client) => {
//     client.emit('receiveListOnlineUsers', connectedUsers);
//     client.emit('receiveListRooms', activeRooms);

//     const { user } = client.handshake.query;
//     const newUser = { user, socketId: client.id, message: [] }
//     connectedUsers[client.id] = newUser;

//     client.broadcast.emit('newOnlineUser', newUser);

//     client.on('sendMessage', data => {
//         const { receiver, message } = data;
//         io.to(receiver).emit("receiveMessage", { message, sender: client.id });
//     });

//     client.on('sendMessageToRoom', data => {
//         const { room, message } = data;

//         client.to(room).emit(
//             "receiveMessageFromRoom",
//             { room, message: {...message, socketId: client.id} }
//         );
//     });

//     client.on('joinRoom', data => {
//         const { room, user } = data;

//         activeRooms[room].connectedUsers[client.id] = true;
//         activeRooms[room].total += 1;

//         client.join(room);
//         io.emit('newUserInRoom', { room, user });
//     });

//     client.on('exitRoom', data => {
//         const { room, user } = data;

//         client.leave(room);

//         for(const room of Object.entries(activeRooms)) {
//             const [ key, value ] = room;
//             const { connectedUsers } = value;
//             if(connectedUsers[client.id]) {
//                 delete activeRooms[key].connectedUsers[client.id];
//                 activeRooms[key].total -= 1;

//                 if(activeRooms[key].total <= 0) {
//                     delete activeRooms[key]
//                     io.emit('removeRoom', { room: key });
//                 }
//                 else io.emit('removeUserRoom', { room: key, user });
//             }
//         }
//     });

//     client.on('newRoom', data => {
//         const newRoom = { message: [], connectedUsers: {}, total: 0 }
//         activeRooms[data.room] = newRoom;
//         io.emit('receiveNewRoom', { [data.room]: newRoom });
//     });

//     client.on('disconnect', data => {
//         delete connectedUsers[client.id]

//         client.broadcast.emit('removeOnlineUser', client.id);

//         for(const room of Object.entries(activeRooms)) {
//             const [ key, value ] = room;
//             const { connectedUsers } = value;
//             if(connectedUsers[client.id]) {
//                 delete activeRooms[key].connectedUsers[client.id];
//                 activeRooms[key].total -= 1;

//                 if(activeRooms[key].total <= 0) {
//                     delete activeRooms[key]
//                     io.emit('removeRoom', { room: key });
//                 }
//                 else io.emit('removeUserRoom', { room: key });
//             }
//         }
//     });
// });
