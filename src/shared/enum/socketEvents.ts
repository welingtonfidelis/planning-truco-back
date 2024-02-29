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
  SERVER_ROOM_SELECT_VOTING_TASK = "server_room_select_voting_task",
  SERVER_ROOM_VOTE_TASK = "server_room_vote_task",
  SERVER_ROOM_SHOW_VOTES = "server_room_show_votes",
  SERVER_ROOM_RESET_VOTES = "server_room_reset_votes",
  SERVER_USER_UPDATE_PROFILE = "server_user_update_profile",

  // client event
  CLIENT_ROOM_NEW_TASK = "client_room_new_task",
  CLIENT_ROOM_DELETE_TASK = "client_room_delete_task",
  CLIENT_ROOM_SELECT_VOTING_TASK = "client_room_select_voting_task",
  CLIENT_ROOM_VOTE_TASK = "client_room_vote_task",
  CLIENT_ROOM_SHOW_VOTES = "client_room_show_votes",
  CLIENT_ROOM_RESET_VOTES = "client_room_reset_votes",
  CLIENT_USER_UPDATE_PROFILE = "client_user_update_profile",
}
