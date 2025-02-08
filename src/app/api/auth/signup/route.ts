import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@models/user";
import { connectDB } from "@/lib/db";
import { GlobalResponse } from "@/types/globalResponse";

export async function POST(req: Request) {
  try {
    const { email, name, password, role } = await req.json(); //extracting from body
    await connectDB();
    const hashedPassword: string = await bcrypt.hash(password, 10); //hashing password
    const newUser = new User({ email, name, password: hashedPassword, role });
    const saveUser = await newUser.save();
    const { password: _, _id, __v, ...userWoPassword } = saveUser.toObject(); // removing password from response
    const response: GlobalResponse = {
      success: true,
      message: "User registered successfully",
      error: null,
      data: userWoPassword,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error:any) {
    console.log(error);
    const response: GlobalResponse = {
        success: false,
        message: "User registration failed",
        error: error.message,
        data: null,
      };
      return NextResponse.json(response,{status:501})
  }
}
