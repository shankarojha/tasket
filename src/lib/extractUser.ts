import { NextRequest, NextResponse } from "next/server";

export function extractUser(req: Request | NextRequest) {
  try {
    const userHeader = req.headers.get("x-user");
    if (!userHeader) return null;

    const user = JSON.parse(userHeader);
    return user;
  } catch (error) {
    console.error("Error parsing x-user header:", error);
    return null;
  }
}
