import { Task } from "./task";
import { User } from "./user";

export interface Room {
  id: string;
  ownerUserId: string;
  users: User[];
  showVotes: boolean;
  currentTaskId: string;
  tasks: Task[];
  scale: string[];
}

export interface RoomIndexed {
  [key: string]: Room;
}