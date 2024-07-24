import { Router } from "express";

import { verifyAuthentication, verifyAuthorization } from "@/middlewares";
import AuthRouter from "./auth.route";
import FileRouter from "./file.route";
import LogRouter from "./log.route";
import NotificationRouter from "./notification.route";
import SessionRouter from "./session.route";
import UserRouter from "./user.route";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/sessions", SessionRouter);
router.use(verifyAuthentication);
router.use("/users", verifyAuthorization(["ADMIN"]), UserRouter);
router.use("/logs", verifyAuthorization(["ADMIN", "DOCTOR"]), LogRouter);
router.use("/notifications", NotificationRouter);
router.use("/files", FileRouter);

export default router;
