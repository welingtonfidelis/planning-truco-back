import { Request, Response } from "express";

export const healthController = {
  healthCheck(req: Request, res: Response) {
    const version = 1; //TODO get package version

    return res.json({ server_on: true, version });
  },
};