"use server";

import { config, retrieve } from "@ui-utils/server";
import { revalidatePath } from "next/cache";
import type { File } from "./types";

export const uploadFiles = async (formData: FormData) => {
  const response = await retrieve(`${config.API_URL}/v1/files/upload`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to upload files");
  }
  revalidatePath("/storage");
  return {
    success: true,
  };
};

export const getFile = async (id: string) => {
  const response = await retrieve(`${config.API_URL}/v1/files/${id}`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to get file");
  }
  return {
    url: json.data.url as string,
    file: json.data.file as File,
  };
};
