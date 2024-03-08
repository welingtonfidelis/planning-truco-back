import { Request, Response } from "express";
import { roomService } from "../../services/room";
import { RequestBody } from "./types";

const { addRoomService } = roomService;

export const roomController = {
  create(req: Request, res: Response) {
    const body = req.body as RequestBody;

    const room = addRoomService(body);

    return res.json({ id: room.id });
  },
};
