"use server";

import { config, retrieve } from "@ui-utils/server";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(id: string) {
  const response = await retrieve(`${config.API_URL}/v1/notifications/${id}`, {
    method: "PATCH",
  });
  const json = (await response.json()) as { message: string };
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/", "layout");
  return {
    success: true,
  };
}
