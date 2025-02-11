import mongoose from "mongoose";
import User from "./user";

interface Task extends mongoose.Document {
  title: string;
  description: string;
  status: "assigned" | "in-progress" | "completed" | "cancelled";
  assignedTo: string;
  createdBy: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  isReassigned: boolean;
  isCompleted: boolean;
  reAssignedDate: Date;
  comments: string;
}

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["assigned", "in-progress", "completed", "cancelled"],
      default: "assigned",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: User },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, required: true },
    isReassigned: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    reAssignedDate: { type: Date },
    comments: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<Task>("Task", taskSchema); //check if already exist
export default Task;
