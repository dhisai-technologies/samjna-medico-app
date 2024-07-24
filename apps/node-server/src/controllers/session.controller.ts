import { db } from "@/db";
import { io } from "@/index";
import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@/utils/helpers";
import { sessions, users } from "@packages/database";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";

export const getSessions: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  const where = and(
    getSearch([sessions.id, sessions.uid, sessions.key, users.email], search),
    ...getFilters(sessions, filtering),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: sessions.id,
        key: sessions.key,
        uid: sessions.uid,
        analytics: sessions.analytics,
        csv: sessions.csv,
        createdAt: sessions.createdAt,
        updateAt: sessions.updatedAt,
        userId: users.id,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(sessions, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(sessions)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched sessions successfully",
    data: {
      sessions: result.map((session) => ({ ...session, users: undefined, user: session.users })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  return res.status(StatusCodes.OK).json({ message: "Session fetched successfully", data: { session } });
});

export const initializeSessionSchema = z.object({
  body: z.object({
    user_id: z.string(),
    uid: z.string(),
  }),
});

export const initializeSession: AppController = catchAsync(async (req, res) => {
  const { uid, user_id } = req.body as z.infer<typeof initializeSessionSchema>["body"];
  const session = await db.query.sessions.findFirst({ where: eq(sessions.uid, uid) });
  if (session) {
    throw new AppError("Session already exists", StatusCodes.BAD_REQUEST);
  }
  const user = await db.query.users.findFirst({ where: eq(users.id, Number.parseInt(user_id)) });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  await db.insert(sessions).values({
    uid,
    userId: user.id,
  });
  return res.status(StatusCodes.CREATED).json({ message: "Session created" });
});

export const updateSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
    key: z.string(),
  }),
});

export const updateSession: AppController = catchAsync(async (req, res) => {
  const { uid, key } = req.body as z.infer<typeof updateSessionSchema>["body"];
  const session = await db.query.sessions.findFirst({ where: eq(sessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(sessions)
    .set({
      key,
    })
    .where(eq(sessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const deleteSessionSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params as z.infer<typeof deleteSessionSchema>["params"];
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(sessions).where(eq(sessions.id, id));
  return res.status(StatusCodes.OK).json({ message: "Session deleted" });
});

export const updateSessionAnalyticsSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    analytics: z.any().optional(),
  }),
});

export const updateSessionAnalytics: AppController = catchAsync(async (req, res) => {
  const { uid, user_id, analytics } = req.body as z.infer<typeof updateSessionAnalyticsSchema>["body"];
  io.to(`analytics-${user_id}`).emit("analytics", analytics);
  const session = await db.query.sessions.findFirst({ where: eq(sessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(sessions)
    .set({
      analytics,
    })
    .where(eq(sessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
});

export const updateSessionCsvSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    csv: z.any().optional(),
  }),
});

export const updateSessionCsv: AppController = catchAsync(async (req, res) => {
  const { uid, user_id, csv } = req.body as z.infer<typeof updateSessionCsvSchema>["body"];
  io.to(`analytics-${user_id}`).emit("csv", csv);
  const session = await db.query.sessions.findFirst({ where: eq(sessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(sessions)
    .set({
      csv,
    })
    .where(eq(sessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session csv updated" });
});
