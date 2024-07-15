import { Router } from "express";

import { parseFiltering, parsePagination, parseSorting, validateRequest } from "@/middlewares";
import type { User } from "@packages/database";

import { createUser, createUserSchema, getUsers, updateUser, updateUserSchema } from "@/controllers/user.controller";

const router: Router = Router();

router.get(
  "/",
  parsePagination,
  parseSorting<User>({
    validColumns: ["name", "email"],
  }),
  parseFiltering<User>({
    validColumns: ["role"],
    validRules: ["inArray"],
  }),
  getUsers,
);
router.post("/", validateRequest(createUserSchema), createUser);
router.patch("/", validateRequest(updateUserSchema), updateUser);

export default router;
