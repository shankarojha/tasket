import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/token";

const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // frontend routes to authorize

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const feToken = req.cookies.get("auth_token")?.value;
  console.log("token", token)
  console.log("fetoken", feToken)

  let user = null;
  let feUser = null;
  if (token) {
    user = verifyToken(token); // Verifing JWT
  }

  if(feToken){
    feUser = feToken;
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
  if (isProtectedPage && !feUser) {
    console.log("here")
    return NextResponse.redirect(new URL("/auth/login", req.url)); // Redirect users who do not have token
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
