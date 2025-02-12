import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GlobalResponse } from "@/types/globalResponse";
import { extractUser } from "@/lib/extractUser";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { formData } =
      await req.json();
      const { userId, oldPassword, newPassword } = formData
    
    if (!oldPassword || !newPassword) {
      const response: GlobalResponse = {
        success: false,
        message: "Missing inpts",
        data: null,
        error: "Missing inpts",
      };

      return NextResponse.json(response, { status: 401 });
    }
    const validUser = await User.findById({_id:userId});
    if(!validUser){
        const response: GlobalResponse = {
            success: false,
            message: "Missing user",
            data: null,
            error: "Missing user",
          };
    
          return NextResponse.json(response, { status: 404 });
    }
    const isMatch = await bcrypt.compare(oldPassword, validUser.password)
    if(!isMatch){
        const response: GlobalResponse = {
            success: false,
            message: "Wrong old password",
            data: null,
            error: "Wrong old password",
          };
    
          return NextResponse.json(response, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    
    const update = await User.updateOne({_id:userId},{password:hashedPassword})

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
