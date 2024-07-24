"use server";

import { config, retrieve } from "@ui-utils/server";
import { revalidatePath } from "next/cache";

export const deleteFile = async (id: string) => {
  const response = await retrieve(`${config.API_URL}/v1/files/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to delete file");
  }
  revalidatePath("/storage");
  return {
    success: true,
  };
};
