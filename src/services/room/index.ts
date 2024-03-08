import { randomUUID } from "crypto";
import isNil from "lodash/isNil";
import isNaN from "lodash/isNaN";

import { roomRepository } from "../../repositories/room";
import { User } from "../../domain/user";
import { Task } from "../../domain/task";
import { Room } from "../../domain/room";
import { JokerCardValue } from "../../shared/const/jokerCardValue";

import { CreateRoomServicePayload } from "./types";

const {
  findById,
  addRoom,
  deleteRoom,
  addUserToRoom,
  deleteUserFromRoom,
  addTaskToRoom,
  deleteTaskFromRoom,
  updateRoom,
  updateUserVote,
} = roomRepository;

export const roomService = {
  findRoomByIdService(id: string) {
    return findById(id);
  },

  addRoomService(payload: CreateRoomServicePayload) {
    const id = randomUUID();
    return addRoom({ id, ...payload });
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

  updateUserVoteService(roomId: string, userId: string, vote: string) {
    return updateUserVote(roomId, userId, vote);
  },

  updateCurrentTaskService(roomId: string, taskId: string) {
    const { users } = findById(roomId);

    const updatedUsers = users.map((user) => ({ ...user, vote: null }));
    return updateRoom(roomId, {
      users: updatedUsers,
      currentTaskId: taskId,
      showVotes: false,
    });
  },

  updateShowVotesService(roomId: string) {
    const { currentTaskId, tasks, users } = findById(roomId);

    const totalVotes = users.reduce((acc, user) => {
      if (
        isNil(user.vote) ||
        isNaN(Number(user.vote)) ||
        JokerCardValue.includes(user.vote)
      ) {
        return acc;
      }

      return (acc += Number(user.vote));
    }, 0);
    
    const points = totalVotes / users.length;

    const updatedTasks = tasks.map((task) => {
      if (task.id === currentTaskId) return { ...task, points };

      return task;
    });

    updateRoom(roomId, { tasks: updatedTasks, showVotes: true });

    return { currentTaskId, points };
  },

  resetVotesService(roomId: string) {
    const { currentTaskId, tasks, users } = findById(roomId);

    const updatedUsers = users.map((user) => ({ ...user, vote: null }));
    const updatedTasks = tasks.map((task) => {
      if (task.id === currentTaskId) return { ...task, points: 0 };

      return task;
    });

    updateRoom(roomId, {
      users: updatedUsers,
      tasks: updatedTasks,
      showVotes: false,
    });

    return { currentTaskId, points: 0 };
  },

  updateUserProfile(roomId: string, userId: string, data: Partial<User>) {
    const { users } = findById(roomId);
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          ...data,
        };
      }

      return user;
    });

    return updateRoom(roomId, { users: updatedUsers });
  },
};
