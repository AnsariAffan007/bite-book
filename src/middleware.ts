import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const sessionId = request.cookies.get("session_id")?.value;

  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}