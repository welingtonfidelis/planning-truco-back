"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    // generic
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["DISCONNECTION"] = "disconnect";
    SocketEvents["EXCEPTION"] = "exception";
    // server event
    SocketEvents["SERVER_ROOM_DATA"] = "server_room_data";
    SocketEvents["SERVER_ROOM_NEW_USER"] = "server_room_new_user";
    SocketEvents["SERVER_ROOM_USER_LOGOUT"] = "server_room_user_logout";
    SocketEvents["SERVER_ROOM_NEW_USER_OWN"] = "server_room_new_user_own";
    SocketEvents["SERVER_ROOM_NEW_TASK"] = "server_room_new_task";
    SocketEvents["SERVER_ROOM_DELETE_TASK"] = "server_room_delete_task";
    SocketEvents["SERVER_ROOM_SELECT_VOTING_TASK"] = "server_room_select_voting_task";
    SocketEvents["SERVER_ROOM_VOTE_TASK"] = "server_room_vote_task";
    SocketEvents["SERVER_ROOM_SHOW_VOTES"] = "server_room_show_votes";
    SocketEvents["SERVER_ROOM_RESET_VOTES"] = "server_room_reset_votes";
    SocketEvents["SERVER_USER_UPDATE_PROFILE"] = "server_user_update_profile";
    // client event
    SocketEvents["CLIENT_ROOM_NEW_TASK"] = "client_room_new_task";
    SocketEvents["CLIENT_ROOM_DELETE_TASK"] = "client_room_delete_task";
    SocketEvents["CLIENT_ROOM_SELECT_VOTING_TASK"] = "client_room_select_voting_task";
    SocketEvents["CLIENT_ROOM_VOTE_TASK"] = "client_room_vote_task";
    SocketEvents["CLIENT_ROOM_SHOW_VOTES"] = "client_room_show_votes";
    SocketEvents["CLIENT_ROOM_RESET_VOTES"] = "client_room_reset_votes";
    SocketEvents["CLIENT_USER_UPDATE_PROFILE"] = "client_user_update_profile";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
//# sourceMappingURL=socketEvents.js.map