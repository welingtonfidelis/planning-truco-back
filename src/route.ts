import { NextFunction, Request, Response, Router } from "express";
import { healthRouter } from "./routes/health";
import { roomRouter } from "./routes/room";

const router = Router();

// NO AUTHENTICATED ROUTES
router.use(healthRouter);
router.use(roomRouter);

// AUTHENTICATED ROUTES

// ERROR HANDLER
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error?.code || 500;
  const errorMessage = error?.message || "Internal server error";

  res.status(statusCode).json({ message: errorMessage });
});

export { router };
