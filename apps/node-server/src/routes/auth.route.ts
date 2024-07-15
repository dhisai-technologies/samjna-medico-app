import { Router } from "express";

import {
  getUser,
  logout,
  requestOtp,
  requestOtpSchema,
  updateProfile,
  updateProfileSchema,
  verifyOtp,
  verifyOtpSchema,
} from "@/controllers/auth.controller";
import { validateRequest, verifyAuthentication } from "@/middlewares";

const router: Router = Router();

router.post("/request-otp", validateRequest(requestOtpSchema), requestOtp);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOtp);

router.use(verifyAuthentication);

router.get("/", getUser);
router.patch("/", validateRequest(updateProfileSchema), updateProfile);
router.post("/logout", logout);

export default router;
