import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@models/user";
import { connectDB } from "@/lib/db";
import { GlobalResponse } from "@/types/globalResponse";
import { z } from "zod";
import { generateToken } from "@/lib/token";
import { TUser } from "@/types/mongodbtypes";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          error: parsed.error.errors,
          data: null,
        },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data; //extracting from body
    const user: any = await User.findOne({ email }).lean();
    if (!user) {
      const response: GlobalResponse = {
        success: false,
        message: "User not found",
        error: "User not found",
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      const response: GlobalResponse = {
        success: false,
        message: "Incorrect email or password",
        error: "Incorrect email or password",
        data: null,
      };
      return NextResponse.json(response, { status: 401 });
    }
    const { password: _, __v, ...userWoPassword } = user; // removing password from response
    const token = generateToken(userWoPassword);
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: false, //since we are using http ec2
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    const response: GlobalResponse = {
      success: true,
      message: "User Loggedin successfully",
      error: null,
      data: { user: userWoPassword, token },
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.log(error);
    const response: GlobalResponse = {
      success: false,
      message: "User registration failed",
      error: error.message,
      data: null,
    };
    return NextResponse.json(response, { status: 501 });
  }
}
