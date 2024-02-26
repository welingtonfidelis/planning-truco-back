import { Request, Response } from "express";
import { roomService } from "../../services/room";

const { addRoomService } = roomService;

export const roomController = {
  create(req: Request, res: Response) {
    const room = addRoomService();

    return res.json({ id: room.id });
  },
};
