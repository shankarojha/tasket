import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/token";

const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // frontend routes to authorize

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  let user = null;
  if (token) {
    user = verifyToken(token); // Verifing JWT
  }

  // Api 
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(user));
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Frontend
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  if (isProtectedPage && !user) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect unauthenticated users
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/protected/:path*",
    "/dashboard/:path*",
    "/tasks/:path*"
  ],
};
