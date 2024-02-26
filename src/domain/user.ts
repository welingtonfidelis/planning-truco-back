export interface User {
  id: string;
  name: string;
  vote: number | null;
}

export interface UserWithRoom extends User {
  roomId: string;
}

export interface UserIndexed {
  [key: string]: UserWithRoom;
}
