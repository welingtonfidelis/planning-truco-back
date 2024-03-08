import Joi from "joi";
import { payloadValidate } from "../../../../shared/payloadValidate";

const createRoomSchema = Joi.object({
  scale: Joi.array().items(Joi.string()).min(1).required(),
});

const validateCreateRoomSchema = payloadValidate(createRoomSchema);

export { validateCreateRoomSchema };
