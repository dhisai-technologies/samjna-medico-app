import { config } from "@/config";
import { db } from "@/db";
import { logger, s3Client } from "@/tools";
import type { MulterS3File } from "@/types";
import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { getPageCount, getSearch, getSort, getWithPagination } from "@/utils/helpers";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { files, users } from "@packages/database";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

export const getFiles: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const where = getSearch([files.id, files.key, files.name, users.email], search);
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: files.id,
        key: files.key,
        name: files.name,
        mimetype: files.mimetype,
        size: files.size,
        createdAt: files.createdAt,
        updateAt: files.updatedAt,
        userId: users.id,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(files)
      .innerJoin(users, eq(users.id, files.userId))
      .where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(files, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(files)
      .innerJoin(users, eq(users.id, files.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(files)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched files successfully",
    data: {
      files: result.map((file) => ({ ...file, users: undefined, user: file.users })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const uploadFiles: AppController = catchAsync(async (req, res) => {
  const multerFiles = req.files as MulterS3File[];
  if (multerFiles.length === 0) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const keys = [] as string[];
  for (const file of multerFiles) {
    const key = `${Date.now().toString()}-${file.originalname}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: key,
        ContentType: file.mimetype,
      }),
    );
    await db.insert(files).values({
      key,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      userId: req.user.id,
    });

    keys.push(key);
  }
  logger.trace({
    userId: req.user.id,
    event: "Storage",
    message: `${multerFiles.length} files have been uploaded`,
  });
  return res.status(StatusCodes.OK).json({
    message: "Files uploaded successfully!",
    data: {
      keys,
    },
  });
});

export const getFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: file.key,
    }),
  );
  return res.status(StatusCodes.OK).json({
    message: "Fetched file successfully",
    data: { url, file },
  });
});

export const updateFileSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const updateFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body as z.infer<typeof updateFileSchema>["body"];
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  if (file.userId !== req.user.id) {
    throw new AppError("You are not authorized to update this file", StatusCodes.UNAUTHORIZED);
  }
  await db
    .update(files)
    .set({
      name,
    })
    .where(eq(files.id, id));
  logger.trace({
    userId: req.user.id,
    event: "Storage",
    message: `${file.id}'s name has been updated`,
  });
  return res.status(StatusCodes.OK).json({
    message: "Updated file successfully",
  });
});

export const deleteFile: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("File id is required", StatusCodes.BAD_REQUEST);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });
  if (!file) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  if (file.userId !== req.user.id) {
    throw new AppError("You are not authorized to delete this file", StatusCodes.UNAUTHORIZED);
  }
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: file.key,
    }),
  );
  await db.delete(files).where(eq(files.id, id));
  logger.debug({
    userId: req.user.id,
    event: "Storage",
    message: `${file.id} has been deleted`,
  });
  return res.status(StatusCodes.OK).json({
    message: "Deleted file successfully",
  });
});
