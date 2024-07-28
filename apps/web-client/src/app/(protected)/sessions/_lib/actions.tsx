"use server";

import { config, retrieve } from "@ui-utils/server";
import { revalidatePath } from "next/cache";

export const deleteSession = async (id: string) => {
  const response = await retrieve(`${config.API_URL}/v1/sessions/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to delete session");
  }
  revalidatePath("/sessions");
  return {
    success: true,
  };
};
