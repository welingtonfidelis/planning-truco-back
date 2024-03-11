export interface User {
  id: string;
  name: string;
  vote: string | null;
}

export interface UserWithRoom extends User {
  roomId: string;
}

export interface UserIndexed {
  [key: string]: UserWithRoom;
}
