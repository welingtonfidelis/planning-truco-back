import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

import { RoomIndexed } from "../../domain/room";
import { User } from "../../domain/user";
import { Task } from "../../domain/task";
import { Room } from "../../domain/room";

const rooms: RoomIndexed = {};

export const roomRepository = {
  findById(id: string) {
    return rooms[id];
  },

  addRoom(id: string) {
    return (rooms[id] = {
      id,
      currentTaskId: "",
      ownerUserId: "",
      showVotes: false,
      tasks: [],
      users: [],
    });
  },

  updateRoom(roomId: string, data: Partial<Room>) {
    return (rooms[roomId] = {
      ...rooms[roomId],
      ...data,
    });
  },

  deleteRoom(id: string) {
    return delete rooms[id];
  },

  addUserToRoom(roomId: string, user: User) {
    if (isNil(rooms[roomId])) return;

    if (
      isEmpty(rooms[roomId]?.ownerUserId) ||
      isNil(rooms[roomId]?.ownerUserId)
    ) {
      rooms[roomId].ownerUserId = user.id;
    }

    rooms[roomId].users.push(user);

    return rooms[roomId];
  },

  deleteUserFromRoom(roomId: string, userId: string) {
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user.id !== userId
    );

    if (!rooms[roomId].users.length) {
      delete rooms[roomId];

      return;
    }

    rooms[roomId].ownerUserId = rooms[roomId].users[0].id;

    return rooms[roomId];
  },

  addTaskToRoom(roomId: string, task: Task) {
    if (isNil(rooms[roomId])) return;

    rooms[roomId].tasks.push(task);

    return task;
  },

  deleteTaskFromRoom(roomId: string, taskId: string) {
    rooms[roomId].tasks = rooms[roomId].tasks.filter(
      (task) => task.id !== taskId
    );

    return rooms[roomId];
  },

  updateUserVote(roomId: string, userId: string, vote: number) {
    const updatedUsers = rooms[roomId].users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          vote,
        };
      }

      return user;
    });

    rooms[roomId].users = updatedUsers;
    
    return rooms[roomId];
  },
};
