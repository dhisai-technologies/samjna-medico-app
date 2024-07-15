import { z } from "zod";

export const requestUserOtpSchema = z.object({
  email: z.string().email(),
});

export type RequestUserOtpSchema = z.infer<typeof requestUserOtpSchema>;

export const verifyUserOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type VerifyUserOtpSchema = z.infer<typeof verifyUserOtpSchema>;
