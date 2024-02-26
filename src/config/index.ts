import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  CORS_DOMAINS: process.env.CORS_DOMAINS as string,
};

export { config };