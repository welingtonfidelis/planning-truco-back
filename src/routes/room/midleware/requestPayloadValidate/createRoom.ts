import Joi from "joi";
import { payloadValidate } from "../../../../shared/payloadValidate";

const createRoomSchema = Joi.object({});

const validateCreateRoomSchema = payloadValidate(createRoomSchema);

export { validateCreateRoomSchema };