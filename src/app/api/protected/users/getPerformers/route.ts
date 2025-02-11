import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import User from "@/models/user";
import mongoose from "mongoose";
import { extractUser } from "@/lib/extractUser";
import { GlobalResponse } from "@/types/globalResponse";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = extractUser(req);
    if (!user) {
      const response: GlobalResponse = {
        success: false,
        message: "Unauthorized access",
        data: null,
        error: "Unauthorized access",
      };

      return NextResponse.json(response, { status: 401 });
    }

    const userRole: string = user.role;
    if(userRole !== "manager"){
        const response: GlobalResponse = {
            success: false,
            message: "Unauthorized access",
            data: null,
            error: "Unauthorized access",
          };
    
          return NextResponse.json(response, { status: 401 });
    }
    const users = await User.find({ role: "performer" })
      .lean();
    if (users.length === 0) {
      const response: GlobalResponse = {
        success: false,
        message: "No users found",
        data: null,
        error: "No users found",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const response: GlobalResponse = {
      success: true,
      message: "Tasks fetched successfully",
      data: users,
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: GlobalResponse = {
      success: false,
      message: "Error fetching task",
      data: null,
      error: (error as Error).message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
