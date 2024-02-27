import { randomUUID } from "crypto";
import { roomRepository } from "../../repositories/room";
import { User } from "../../domain/user";
import { Task } from "../../domain/task";
import { Room } from "../../domain/room";

const {
  findById,
  addRoom,
  deleteRoom,
  addUserToRoom,
  deleteUserFromRoom,
  addTaskToRoom,
  deleteTaskFromRoom,
  updateRoom,
} = roomRepository;

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

  updateRoomService(roomId: string, room: Partial<Room>) {
    return updateRoom(roomId, room);
  },

  addUserToRoomService(roomId: string, user: User) {
    return addUserToRoom(roomId, user);
  },

  deleteUserFromRoomService(roomId: string, userId: string) {
    return deleteUserFromRoom(roomId, userId);
  },

  addTaskToRoomService(roomId: string, task: Task) {
    task.id = randomUUID();

    return addTaskToRoom(roomId, task);
  },

  deleteTaskFromRoomService(roomId: string, taskId: string) {
    return deleteTaskFromRoom(roomId, taskId);
  },
};
