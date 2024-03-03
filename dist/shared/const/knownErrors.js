"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownErrors = void 0;
exports.KnownErrors = {
    //ROOMS
    MISSING_ROOM: {
        name: 'MISSING_ROOM',
        message: 'Missing room id',
        code: 400,
        use: '/socket/connection'
    },
    INVALID_ROOM: {
        name: 'INVALID_ROOM',
        message: 'Invalid room id',
        code: 400,
        use: '/socket/connection'
    },
    //USERS
    INVALID_CREATE_USER: {
        name: 'INVALID_CREATE_USER',
        message: 'Invalid data to create user',
        code: 400,
        use: '/socket/connection'
    },
};
//# sourceMappingURL=knownErrors.js.map