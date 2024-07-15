import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import type { rolesEnum } from "@packages/database";

export const verifyAuthorization = (allowedRoles: (typeof rolesEnum.enumValues)[number][]): AppController =>
  catchAsync(async (req, _res, next) => {
    const user = req.user;
    if (!allowedRoles.includes(user.role)) {
      throw new AppError("Forbidden, you are not authorized to access this data", StatusCodes.FORBIDDEN);
    }
    next();
  });
