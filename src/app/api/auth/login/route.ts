import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@models/user"
import { connectDB } from "@/lib/db";

export async function POST(req:Request) {
    const {email, name, password, role} =  await req.json();
    return NextResponse.json({email, name, password, role})
}