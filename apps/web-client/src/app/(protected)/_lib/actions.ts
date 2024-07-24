"use server";

import { appConfig } from "@ui-utils/config";

export async function processFile(formData: FormData) {
  const response = await fetch(`${appConfig.fastapi}/process/file`, {
    method: "POST",
    body: formData,
  });
  return response.json();
}
