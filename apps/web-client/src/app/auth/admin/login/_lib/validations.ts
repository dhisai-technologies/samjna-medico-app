import { z } from "zod";

export const requestAdminOtpSchema = z.object({
  email: z.string().email(),
  key: z.string().min(8),
});

export type RequestAdminOtpSchema = z.infer<typeof requestAdminOtpSchema>;

export const verifyAdminOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type VerifyAdminOtpSchema = z.infer<typeof verifyAdminOtpSchema>;
