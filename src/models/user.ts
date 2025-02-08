import mongoose from "mongoose";

interface TUser extends mongoose.Document{
    name: string,
    email:string,
    password: string,
    role: "manager" | "user"
}

const userSchema = new mongoose.Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "user"] },
  },
  { timestamps: true, autoIndex: true }
);

const User = mongoose.models.User || mongoose.model<TUser>("User", userSchema) //check if already exist 
export default User;
