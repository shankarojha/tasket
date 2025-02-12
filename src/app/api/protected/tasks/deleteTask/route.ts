import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GlobalResponse } from "@/types/globalResponse";
import Task from "@/models/task";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { formData } = await req.json();
    const { taskId } = formData;

    if (!taskId) {
      const response: GlobalResponse = {
        success: false,
        message: "Missing inpts",
        data: null,
        error: "Missing inpts",
      };

      return NextResponse.json(response, { status: 401 });
    }

    const update = await Task.updateOne(
      { _id: taskId },
      { status: "cancelled" }
    );

    const response: GlobalResponse = {
      success: true,
      message: "Password updated successfully",
      data: update,
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
