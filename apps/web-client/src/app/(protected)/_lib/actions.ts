"use server";

import { appConfig } from "@ui-utils/config";

export async function processFile(formData: FormData) {
  const response = await fetch(`${appConfig.api.python}/process/file`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to process file");
  }
  const json = await response.json();
  const { uid } = json.data as {
    uid: string;
  };
  return {
    uid,
  };
}
