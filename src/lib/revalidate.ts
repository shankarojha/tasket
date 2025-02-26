"use server";

import { revalidatePath } from "next/cache";

export const refreshPerformers = async () => {
  revalidatePath("/dashboard"); // Adjust based on where performers are listed
};

export const refreshTasks = async () => {
  revalidatePath("/tasks"); // Adjust if tasks are displayed elsewhere
};