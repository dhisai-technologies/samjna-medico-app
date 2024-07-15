import path from "node:path";
import * as dotenv from "dotenv";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

export const config = {
  NAME: "samjna-medico-server",
  VERSION: "v1",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_KEY: process.env.ADMIN_KEY || "",
  OTP_EXPIRY: 5,
  OTP_RETRIES: 3,
  OTP_SUSPEND_TIME: 60,
  NODEMAILER_USER: process.env.NODEMAILER_USER || "",
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || "",
  NODEMAILER_FROM_EMAIL: process.env.NODEMAILER_FROM_EMAIL || "",
  AMQP_URL: process.env.AMQP_URL || "",
  CLIENT_URL: "http://localhost:8000",
  CLIENT_APP_TITLE: "Samjna Medico",
};
