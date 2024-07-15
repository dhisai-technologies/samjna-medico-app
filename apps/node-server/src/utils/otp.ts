import fs from "node:fs";
import path from "node:path";
import { config } from "@/config";
import nodemailer from "nodemailer";

export function generateOtp() {
  return {
    otp: Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0"),
    expiresAt: new Date(Date.now() + config.OTP_EXPIRY * 60 * 1000),
  };
}

export async function sendOtp(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.NODEMAILER_USER,
      pass: config.NODEMAILER_PASS,
    },
  });
  const templatePath = path.join(__dirname, "../templates/otp-template.html");
  const templateContent = await fs.promises.readFile(templatePath, "utf8");
  const html = templateContent.replace("{{OTP}}", otp);
  await transporter.sendMail({
    from: config.NODEMAILER_FROM_EMAIL,
    to,
    subject: "OTP for verification",
    html,
  });
}
