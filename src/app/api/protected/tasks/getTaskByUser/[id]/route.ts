import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/task";
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response: GlobalResponse = {
        success: false,
        message: "Invalid Task ID",
        data: null,
        error: "Invalid Task ID",
      };
      return NextResponse.json(response, { status: 400 });
    }
    //finding and attaching  user ref ro response
    const task = await Task.find({ createdBy: userId })
      .populate("assignedTo")
      .populate("createdBy")
      .lean();
    if (task.length === 0) {
      const response: GlobalResponse = {
        success: false,
        message: "No tasks assigned",
        data: null,
        error: "No tasks assigned",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const response: GlobalResponse = {
      success: true,
      message: "Tasks fetched successfully",
      data: task,
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
