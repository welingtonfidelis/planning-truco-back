import { randomUUID } from "crypto";
import { roomRepository } from "../../repositories/room";
import { User } from "../../domain/user";

const { findById, addRoom, deleteRoom, addUserToRoom, deleteUserFromRoom } = roomRepository;

export const roomService = {
  findRoomByIdService(id: string) {
    return findById(id);
  },

  addRoomService() {
    const id = randomUUID();
    return addRoom(id);
  },

  deleteRoomService(id: string) {
    return deleteRoom(id);
  },

  addUserToRoomService(roomId: string, user: User) {
    return addUserToRoom(roomId, user);
  },

  deleteUserFromRoomService(roomId: string, userId: string) {
    return deleteUserFromRoom(roomId, userId);
  }
};
