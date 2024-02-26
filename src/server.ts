import SocketIo from "socket.io";
import express from "express";
import cors from "cors";
import "express-async-errors";

import { router } from "./route";
import { config } from "./config";
import { socketListener } from './socket'

const { PORT, CORS_DOMAINS } = config;

const corsDomain = CORS_DOMAINS.split(",").map((item) => item.trim());
const corsOptions = {
  origin: corsDomain,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

const expressServer = app.listen(PORT, function () {
  console.log(`Server running in ${PORT}\n`);
});

const socketServer = new SocketIo.Server(expressServer, {
  cors: { origin: corsDomain },
});

socketListener(socketServer);
