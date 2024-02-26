import { Router } from "express";
import { roomController } from "../../controllers/room";
import { validateCreateRoomSchema } from "./midleware/requestPayloadValidate/createRoom";

const roomRouter = Router();

roomRouter.post("/rooms", validateCreateRoomSchema,roomController.create);

export { roomRouter };
