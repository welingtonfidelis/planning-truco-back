import { Router } from "express";
import { healthController } from "../../controllers/health";

const healthRouter = Router();

healthRouter.get("/health", healthController.healthCheck);

export { healthRouter };
