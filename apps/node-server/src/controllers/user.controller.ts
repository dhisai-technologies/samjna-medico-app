import { and, count, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@/utils/helpers";
import { type User, rolesEnum, users } from "@packages/database";

import { config } from "@/config";
import { db } from "@/db";
import { notifier } from "@/tools";

export const getUsers: AppController = catchAsync(async (req, res) => {
  const { user, search, filtering, sorting, pagination } = req;
  const where = and(
    ne(users.id, user.id),
    getSearch([users.email, users.name], search),
    ...getFilters(users, filtering),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        active: users.active,
      })
      .from(users)
      .where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(users, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(users)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched users",
    data: {
      users: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string(),
    role: z.enum(rolesEnum.enumValues),
  }),
});

export const createUser: AppController = catchAsync(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    throw new AppError("Cannot create SUPER_ADMIN or ADMIN role", StatusCodes.BAD_REQUEST);
  }
  const user = (await db
    .insert(users)
    .values({
      name: name,
      email: email,
      role,
    })
    .returning()
    .then((res) => res[0] ?? null)) as User;
  notifier.important({
    userId: user.id,
    message: `Admin welcomes you to ${config.CLIENT_APP_TITLE}`,
    type: "COMMON",
  });
  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
  });
});

export const updateUserSchema = z.object({
  body: z.object({
    userId: z.number(),
    email: z.string().optional(),
    name: z.string().optional(),
    role: z.enum(rolesEnum.enumValues).optional(),
    active: z.boolean().optional(),
  }),
});

export const updateUser: AppController = catchAsync(async (req, res) => {
  const { userId, email, name, role, active } = req.body as z.infer<typeof updateUserSchema>["body"];
  if (role === "ADMIN") {
    throw new AppError("Cannot create ADMIN role", StatusCodes.BAD_REQUEST);
  }
  if (email) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existing) {
      throw new AppError("User already exists", StatusCodes.CONFLICT);
    }
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(users)
    .set({
      email,
      name,
      role,
      active,
    })
    .where(eq(users.id, userId));
  notifier.default({
    userId: userId,
    message: "Your account details have been updated by admin",
    type: "COMMON",
  });
  return res.status(StatusCodes.OK).json({
    message: "User updated successfully",
  });
});
