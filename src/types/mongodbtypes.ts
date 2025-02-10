import { Document } from 'mongoose';

export interface TUser extends Document{
    name: string | null,
    email:string | null,
    password: string | null,
    role: "manager" | "user" | null,
    _id:string | null,
    __v: number | null
}

export interface Task{
    title: string;
  description: string;
  status: "assigned" | "in-progress" | "completed" | "cancelled";
  assignedTo: TUser;
  createdBy: TUser;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  isReassigned: boolean;
  isCompleted: boolean;
  reAssignedDate: Date;
  comments: string;
  _id:string;
}