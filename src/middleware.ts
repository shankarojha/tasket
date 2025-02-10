import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // FE routes to protect

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.get("auth_token")?.value;;
  const feToken = req.cookies.get("auth_token")?.value; // FE auth token from the cookies

  console.log("Backend Token:", token);
  console.log("Frontend Token:", feToken);

  let user = null;

  // Verifying BE token
  if (token) {
    try {
      const res = await axios.post(
        `${req.nextUrl.origin}/api/auth/verifyToken`,
        { token }
      );
      if (res.status === 200) user = res.data.user;
    } catch (error: any) {
      console.error(
        "Token verification failed:",
        error.response?.data || error.message
      );
    }
  }

  // For /api/protected protected rouites
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(user)); // Attaching user info to the header x-user
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // FE Protection
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedPage && !feToken) {
    console.log("Redirecting to Login: No valid frontend token");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*", "/dashboard/:path*", "/tasks/:path*"],
};
