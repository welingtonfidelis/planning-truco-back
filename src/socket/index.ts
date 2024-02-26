import socketIo from "socket.io";
import { roomService } from "../services/room";
import { KnownErrors } from "../shared/enum/knownErrors";
import { isNil, isString } from "lodash";

const { INVALID_ROOM, MISSING_ROOM, INVALID_CREATE_USER } = KnownErrors;

const {
  findRoomByIdService,
  addUserToRoomService,
  deleteUserFromRoomService,
} = roomService;

export const socketListener = (socketServer: socketIo.Server) => {
  socketServer.on("connection", (socket) => {
    const userName = socket.handshake.query.userName as string;
    const roomId = socket.handshake.query.roomId as string;

    console.log("socket: ", roomId, socket.id, userName);

    // EXCEPTIONS
    if (isNil(roomId)) {
      socket.emit("exception", MISSING_ROOM);
      socket.disconnect();
    }

    const roomExists = findRoomByIdService(roomId);

    if (!isString(roomId) || !roomExists) {
      socket.emit("exception", INVALID_ROOM);
      socket.disconnect();
    }

    if (!userName) {
      socket.emit("exception", INVALID_CREATE_USER);
      socket.disconnect();
    }

    // LOGOUT
    socket.on("disconnect", () => {
      deleteUserFromRoomService(roomId, socket.id);
      
      socket.to(roomId).emit("userLogout", socket.id);
      socket.leave(roomId);
    });

    const newUser = {
      id: socket.id,
      name: userName as string,
      vote: null,
    };
    const room = addUserToRoomService(roomId, newUser);

    socket.join(roomId);
    socket.emit("roomData", room);
    socket.to(roomId).emit("newUser", newUser);
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
