import path from "node:path";
import * as dotenv from "dotenv";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

export const config = {
  SERVICE_NAME: "node-server",
  SERVICE_VERSION: "v1",
  SERVICE_PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
