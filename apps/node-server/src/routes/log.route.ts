import { getLogs } from "@/controllers/log.controller";
import { parseFiltering, parsePagination, parseSorting } from "@/middlewares";
import type { Log } from "@packages/database";
import { Router } from "express";

const router: Router = Router();

router.get(
  "/",
  parsePagination,
  parseSorting<Log>({
    validColumns: ["level", "createdAt"],
  }),
  parseFiltering<Log>({
    validColumns: ["level"],
    validRules: ["inArray"],
  }),
  getLogs,
);

export default router;
