import { db } from "@/db";
import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { notifications } from "@packages/database";
import { eq } from "drizzle-orm";

export const markNotificationAsRead: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Notification id is required", StatusCodes.BAD_REQUEST);
  }
  if (id === "all") {
    await db.delete(notifications).where(eq(notifications.userId, req.user.id));
    return res.status(StatusCodes.OK).json({ message: "All notifications marked as read" });
  }
  const notification = await db.query.notifications.findFirst({ where: eq(notifications.id, id) });
  if (!notification) {
    throw new AppError("Notification not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(notifications).where(eq(notifications.id, id));
  return res.status(StatusCodes.OK).json({ message: "Notification marked as read" });
});
