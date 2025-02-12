import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import mongoose from "mongoose";
import { extractUser } from "@/lib/extractUser";
import { GlobalResponse } from "@/types/globalResponse";

export async function PATCH(
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
    const reqBody = await req.json();
    const updatedTask = await Task.findByIdAndUpdate({_id:taskId}, reqBody.formData);
    const response: GlobalResponse = {
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: GlobalResponse = {
      success: false,
      message: "Error updating task",
      data: null,
      error: (error as Error).message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
