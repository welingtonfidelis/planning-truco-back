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
  updateUserVote,
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

  updateUserVoteService(roomId: string, userId: string, vote: number) {
    return updateUserVote(roomId, userId, vote);
  },

  updateShowVotes(roomId: string, showVotes: boolean) {
    const { currentTaskId, tasks, users } = findById(roomId);

    if (showVotes) {
      const totalVotes = users.reduce(
        (acc, user) => (acc += user.vote ?? 0),
        0
      );
      const averageVotes = totalVotes / users.length;
      const updatedTasks = tasks.map((task) => {
        if (task.id === currentTaskId) return { ...task, points: averageVotes };

        return task;
      });

      console.log('updatedTasks: ', updatedTasks);
      updateRoom(roomId, { tasks: updatedTasks, showVotes });

      return { tasks: updatedTasks };
    }

    const updatedUsers = users.map((user) => ({ ...user, vote: null }));
    const updatedTasks = tasks.map((task) => {
      if (task.id === currentTaskId) return { ...task, points: 0 };

      return task;
    }); 

    updateRoom(roomId, { users: updatedUsers, tasks: updatedTasks });

    return { users: updatedUsers, tasks: updatedTasks };
  },
};
