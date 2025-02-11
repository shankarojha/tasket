export const runtime = "nodejs"; // mod for edge runtime to nodejs runtime

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    console.log("token", token)
    


    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
