"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRoomSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const payloadValidate_1 = require("../../../../shared/payloadValidate");
const createRoomSchema = joi_1.default.object({});
const validateCreateRoomSchema = (0, payloadValidate_1.payloadValidate)(createRoomSchema);
exports.validateCreateRoomSchema = validateCreateRoomSchema;
//# sourceMappingURL=createRoom.js.map