import { roles } from "@ui-utils/types";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(roles),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  userId: z.string().transform((value) => Number.parseInt(value, 10)),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(roles),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
