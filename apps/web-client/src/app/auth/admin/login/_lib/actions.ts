"use server";

import { catchAsync, config, retrieve } from "@ui-utils/server";
import type { ServerActionResponse, User } from "@ui-utils/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { requestAdminOtpSchema, verifyAdminOtpSchema } from "./validations";

export const requestAdminOtp = catchAsync(async (_prevState: ServerActionResponse, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = requestAdminOtpSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.API_URL}/v1/auth/request-otp`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  return {
    success: true,
  };
});

export const resendAdminOtp = async (email: string, key: string) => {
  const response = await retrieve(`${config.API_URL}/v1/auth/request-otp`, {
    method: "POST",
    body: JSON.stringify({ email, key }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return {
    success: true,
  };
};

export const verifyAdminOtp = async (_prevState: ServerActionResponse, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = verifyAdminOtpSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.API_URL}/v1/auth/verify-otp`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  const result = json.data as {
    token: string;
    user: User;
  };
  const cookie = cookies();
  cookie.set("token", result.token, {
    path: "/",
  });
  revalidatePath("/", "layout");
  return {
    user: result.user,
  };
};
