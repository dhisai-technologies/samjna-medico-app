import { cookies } from "next/headers";

import { config } from "./env";

export async function retrieve(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
  const cookie = cookies().get("token");
  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${cookie?.value}`,
      "x-api-key": config.API_KEY,
    },
  });
}
