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
    const userId = params.id;
      
    const users = await User.findById({ _id: userId }).lean();
    if (!users) {
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
