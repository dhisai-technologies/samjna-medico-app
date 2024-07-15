"use server";
import { config, retrieve } from "@ui-utils/server";
import { cookies } from "next/headers";

export async function logout() {
  const cookie = cookies();
  try {
    await retrieve(`${config.API_URL}/v1/auth/logout`, {
      method: "POST",
    });
  } catch (_) {
    throw new Error("Failed to logout");
  }
  cookie.delete("token");
}
