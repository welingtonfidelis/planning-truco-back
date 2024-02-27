export enum SocketEvents {
  // generic
  CONNECTION = "connection",
  DISCONNECTION = "disconnect",
  EXCEPTION = "exception",

  // server event
  SERVER_ROOM_DATA = "server_room_data",
  SERVER_ROOM_NEW_USER = "server_room_new_user",
  SERVER_ROOM_USER_LOGOUT = "server_room_user_logout",
  SERVER_ROOM_NEW_USER_OWN = "server_room_new_user_own",
  SERVER_ROOM_NEW_TASK = "server_room_new_task",
  SERVER_ROOM_DELETE_TASK = "server_room_delete_task",

  // client event
  CLIENT_ROOM_NEW_TASK = "client_room_new_task",
  CLIENT_ROOM_DELETE_TASK = "client_room_delete_task",
}
