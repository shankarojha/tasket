import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/token"; // jwt verify function import

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization"); // authorization token from the header should start with "Bearer"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized - No Token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1]; // get just the token
  const user = verifyToken(token); //store decoded user details

  if (!user) {
    return NextResponse.next();
  }

  console.log("Auth done", user);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user", JSON.stringify(user)); // Attaching user details to header x-user

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/api/protected/:path*"], // applying to specific routes
};
