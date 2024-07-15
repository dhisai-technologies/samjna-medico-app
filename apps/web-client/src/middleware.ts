import { config as env, retrieve } from "@ui-utils/server";
import type { User } from "@ui-utils/types";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  try {
    const response = await retrieve(`${env.API_URL}/v1/auth`);
    const result = (await response.json()) as {
      data: { user: User };
    };
    if (!response.ok) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    headers.set("x-next-user", JSON.stringify(result.data.user));
  } catch (err) {
    console.error(err);
  }
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (Login route)
     * - proxy (Proxy routes to API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
