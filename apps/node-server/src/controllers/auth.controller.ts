import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { config } from "@/config";
import { db } from "@/db";
import { type AppController, AppError, StatusCodes, catchAsync } from "@/utils/errors";
import { signToken } from "@/utils/helpers";
import { generateOtp, sendOtp } from "@/utils/otp";
import { otps, users } from "@packages/database";

export const requestOtpSchema = z.object({
  body: z.object({
    email: z.string(),
    key: z.string().optional(),
  }),
});

export const requestOtp: AppController = catchAsync(async (req, res) => {
  const { email, key } = req.body as z.infer<typeof requestOtpSchema>["body"];
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.BAD_REQUEST);
  }
  if (!user.active) {
    throw new AppError("User is not active", StatusCodes.BAD_REQUEST);
  }
  if (user.role === "ADMIN") {
    if (key !== config.ADMIN_KEY) {
      throw new AppError("Invalid key", StatusCodes.FORBIDDEN);
    }
  }
  const existing = await db.query.otps.findFirst({
    where: eq(otps.userId, user.id),
  });
  if (!existing) {
    const { otp, expiresAt } = generateOtp();
    await db.insert(otps).values({
      userId: user.id,
      otp,
      expiresAt,
      retries: 1,
    });

    await sendOtp(user.email, otp);

    return res.status(StatusCodes.OK).json({
      message: "Otp sent successfully to your mail",
    });
  }
  if (existing.retries < config.OTP_RETRIES && new Date().getTime() < existing.expiresAt.getTime()) {
    await db
      .update(otps)
      .set({
        retries: sql`${otps.retries} + 1`,
      })
      .where(eq(otps.id, existing.id));

    await sendOtp(user.email, existing.otp);

    return res.status(StatusCodes.OK).json({
      message: "Otp sent successfully to your mail",
    });
  }
  // const suspendedDate = new Date(existing.updatedAt.getTime() + config.OTP_SUSPEND_TIME * 60 * 1000);
  // if (existing.retries >= config.OTP_RETRIES && new Date().getTime() < suspendedDate.getTime()) {
  //   logger.trace({
  //     userId: user.id,
  //     event: "Auth",
  //     message: `Account suspended for ${config.OTP_SUSPEND_TIME} minutes`,
  //   });
  //   throw new AppError(
  //     `Your account has been suspended for ${config.OTP_SUSPEND_TIME} minutes, please try later`,
  //     StatusCodes.BAD_REQUEST,
  //   );
  // }
  const { otp, expiresAt } = generateOtp();
  await db
    .update(otps)
    .set({
      otp,
      expiresAt,
      retries: 1,
    })
    .where(eq(otps.id, existing.id));

  await sendOtp(user.email, otp);

  return res.status(StatusCodes.OK).json({
    message: "Otp sent successfully to your mail",
  });
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string(),
    otp: z.string(),
  }),
});

export const verifyOtp: AppController = catchAsync(async (req, res) => {
  const { email, otp } = req.body as z.infer<typeof verifyOtpSchema>["body"];
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  }
  if (!user.active) {
    throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  }
  const savedOtp = await db.query.otps.findFirst({
    where: eq(otps.userId, user.id),
  });
  if (!savedOtp || savedOtp.otp !== otp) {
    throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  }
  const token = await signToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET as string,
    "1d",
  );
  return res.status(StatusCodes.OK).json({
    message: "Logged in successfully",
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    },
  });
});

export const logout: AppController = catchAsync(async (_req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "Logged out successfully",
  });
});

export const getUser: AppController = catchAsync(async (req, res) => {
  const user = req.user;
  return res.status(StatusCodes.OK).json({
    message: "Refreshed Credentials Successfully",
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  });
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const updateProfile: AppController = catchAsync(async (req, res) => {
  const { name } = req.body as z.infer<typeof updateProfileSchema>["body"];
  const user = req.user;
  const updated = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, user.id))
    .returning()
    .then((res) => res[0]);
  return res.status(StatusCodes.OK).json({
    message: "Updated user successfully",
    data: {
      user: {
        email: updated?.email,
        name: updated?.name,
        role: updated?.role,
      },
    },
  });
});
