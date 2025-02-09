import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@models/user";
import { connectDB } from "@/lib/db"
import { GlobalResponse } from "@/types/globalResponse";
import {z} from "zod"

const signupSchema = z.object({
  email:z.string().email(), 
  name: z.string(), 
  password:z.string(), 
  role:z.enum(["manager", "user"])
})

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", error: parsed.error.errors, data: null },
        { status: 400 }
      );
    }
    const { email, name, password, role } = parsed.data; //extracting from body
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
