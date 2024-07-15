import { and, count, eq } from "drizzle-orm";

import { type AppController, StatusCodes, catchAsync } from "@/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@/utils/helpers";
import { logs, users } from "@packages/database";

import { db } from "@/db";

export const getLogs: AppController = catchAsync(async (req, res) => {
  const { search, filtering, sorting, pagination } = req;
  const where = and(getSearch([logs.message, logs.event, users.email], search), ...getFilters(logs, filtering));
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: logs.id,
        message: logs.message,
        event: logs.event,
        level: logs.level,
        createdAt: logs.createdAt,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(logs)
      .innerJoin(users, eq(users.id, logs.userId))
      .where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(logs, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(logs)
      .innerJoin(users, eq(users.id, logs.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched logs successfully",
    data: {
      logs: result.map((log) => ({ ...log, users: undefined, user: log.users })),
      pageCount: getPageCount(total, pagination),
    },
  });
});
