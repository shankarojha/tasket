// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // FE routes to protect

// export async function middleware(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader || req.cookies.get("auth_token")?.value;
  
//   console.log("Backend Token:", token);
//   console.log("Authorization Header:", authHeader);

//   let user = null;

//   // Verify BE token using fetch (Axios does not work in Edge Middleware)
//   if (token) {
//     try {
//       const res = await fetch(`${req.nextUrl.origin}/api/auth/verifyToken`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Ensure token is sent correctly
//         },
//         body: JSON.stringify({ token }),
//       });

//       if (res.ok) {
//         user = await res.json();
//       } else {
//         console.error("Token verification failed:", await res.json());
//       }
//     } catch (error) {
//       console.error("Middleware Error: Failed to verify token", error);
//     }
//   }

//   // Protect API routes
//   if (req.nextUrl.pathname.startsWith("/api/protected")) {
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set("x-user", JSON.stringify(user)); // Attach user info
//     return NextResponse.next({ request: { headers: requestHeaders } });
//   }

//   // FE Protection
//   const isProtectedPage = PROTECTED_ROUTES.some((route) =>
//     req.nextUrl.pathname.startsWith(route)
//   );

//   if (isProtectedPage && !user) {
//     console.log("Redirecting to Login: No valid token found");
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/protected/:path*", "/dashboard/:path*", "/tasks/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard", "/tasks"]; // Protected frontend routes

export async function middleware(req: NextRequest) {
  // Extract token from NextAuth.js session
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log("Middleware Token:", req);

  // 🔹 1. Protect API Routes (Backend)
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(token.user)); // Attach user info
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 🔹 2. Protect Frontend Routes
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedPage && !token) {
    console.log("Redirecting to Login: No valid session found");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// 🔹 Apply middleware to protected routes
export const config = {
  matcher: ["/api/protected/:path*", "/dashboard/:path*", "/tasks/:path*"],
};

