import { Document } from 'mongoose';

export interface TUser extends Document{
    name: string | null,
    email:string | null,
    password: string | null,
    role: "manager" | "user" | null,
    _id:string | null,
    __v: number | null
}