import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db } from "@/db";
import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { verifyToken } from "@/utils/helpers";
import { users } from "@packages/database";

export const verifyAuthentication: AppController = catchAsync(async (req, _res, next) => {
  let token: string | undefined = "";
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let decoded: any;
  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    decoded = (await verifyToken(token, config.JWT_SECRET || "")) as any;
  } catch (_) {
    throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
  }
  if (!decoded || !decoded.id) {
    throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.id),
  });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  if (!user.active) {
    throw new AppError("User is not active, please contact your organization", StatusCodes.BAD_REQUEST);
  }
  req.user = user;
  next();
});
