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
    

    const taskId = params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const response: GlobalResponse = {
        success: false,
        message: "Invalid Task ID",
        data: null,
        error: "Invalid Task ID",
      };
      return NextResponse.json(response, { status: 400 });
    }
    //get the task
    const task = await Task.findOne({ _id: taskId })
      .populate("assignedTo")
      .populate("createdBy")
      .lean();
    if (!task) {
      const response: GlobalResponse = {
        success: false,
        message: "Taskid Missing",
        data: null,
        error: "Taskid Missing",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: GlobalResponse = {
      success: true,
      message: "Task fetched successfully",
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
