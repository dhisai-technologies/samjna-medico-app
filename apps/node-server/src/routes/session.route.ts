import {
  deleteSession,
  deleteSessionSchema,
  getSession,
  getSessions,
  initializeSession,
  initializeSessionSchema,
  updateSession,
  updateSessionAnalytics,
  updateSessionAnalyticsSchema,
  updateSessionCsv,
  updateSessionCsvSchema,
  updateSessionSchema,
} from "@/controllers/session.controller";
import { parseFiltering, parsePagination, parseSorting, validateRequest, verifyAuthentication } from "@/middlewares";
import type { Session } from "@packages/database";
import { Router } from "express";

const router: Router = Router();

router.post("/", validateRequest(initializeSessionSchema), initializeSession);
router.post("/analytics", validateRequest(updateSessionAnalyticsSchema), updateSessionAnalytics);
router.post("/csv", validateRequest(updateSessionCsvSchema), updateSessionCsv);

router.use(verifyAuthentication);

router.get(
  "/",
  parsePagination,
  parseSorting<Session>({
    validColumns: ["createdAt", "updatedAt"],
  }),
  parseFiltering<Session>({
    validColumns: ["createdAt"],
    validRules: ["between"],
  }),
  getSessions,
);
router.get("/:id", getSession);
router.patch("/", validateRequest(updateSessionSchema), updateSession);
router.delete("/:id", validateRequest(deleteSessionSchema), deleteSession);

export default router;
