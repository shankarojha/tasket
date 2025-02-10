import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import { GlobalResponse } from "@/types/globalResponse";
import { extractUser } from "@/lib/extractUser";

export async function POST(req: Request) {
  try {
    const { title, description, assignedTo, priority, dueDate } =
      await req.json();
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
    console.log("user:", user._id);
    if (!title || !description || !dueDate) {
      const response: GlobalResponse = {
        success: false,
        message: "Missing inpts",
        data: null,
        error: "Missing inpts",
      };

      return NextResponse.json(response, { status: 401 });
    }

    await connectDB();
    const newTask = await Task.create({
      title,
      description,
      status: "assigned",
      assignedTo,
      createdBy: user._id,
      priority: priority || "medium",
      dueDate,
    });

    const response: GlobalResponse = {
      success: true,
      message: "Task created successfully",
      data: newTask,
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
