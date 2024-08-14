import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  CORS_DOMAINS: process.env.CORS_DOMAINS as string,
  CERTIFICATE_KEY: process.env.CERTIFICATE_KEY as string,
  CERTIFICATE_CERT: process.env.CERTIFICATE_CERT as string,
};

export { config };