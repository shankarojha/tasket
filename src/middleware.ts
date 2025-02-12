import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // FE routes to protect

export async function middleware(req: NextRequest) {
  const cookieStore  = await cookies();
  // const authHeader = req.headers.get("authorization");
  // const token = authHeader?.startsWith("Bearer ")
  //   ? authHeader.split(" ")[1]
  //   : cookies.get('auth_token')
  // const feToken = req.cookies.get("auth_token")?.value; // FE auth token from the cookies

  const token = cookieStore.get("auth_token")?.value
  const feToken = cookieStore.get("auth_token")?.value

  console.log("Backend Token:", token);
  console.log("Frontend Token:", feToken);

  let user = null;

  // Verifying BE token
  if (token) {
    try {
      const res = await axios.post(
        //`http://35.154.85.104/api/auth/verifyToken`,
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
    // cookieStore.set("user",user,{
    //   httpOnly: true,  // Prevents client-side JavaScript access
    //   sameSite: "strict", // Prevent CSRF attacks
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   path: "/", // Available across the entire site
    // })
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