import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GlobalResponse } from "@/types/globalResponse";
import Task from "@/models/task";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const taskId = params.id;
    if (!taskId) {
      const response: GlobalResponse = {
        success: false,
        message: "Missing inpts",
        data: null,
        error: "Missing inpts",
      };

      return NextResponse.json(response, { status: 401 });
    }

    await Task.findByIdAndDelete({_id:taskId});
    const response: GlobalResponse = {
      success: true,
      message: "Deleted successfully",
      data: null,
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
