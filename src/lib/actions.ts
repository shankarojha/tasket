import axiosInstance from "./axiosInstance";
import { revalidatePath } from "next/cache";
import { refreshPerformers, refreshTasks } from "./revalidate";

export const getTasksByUser = async (id: string) => {
  const response = await axiosInstance.get(
    `protected/tasks/getTaskByUser/${id}`
  );
  return response.data;
};

export const getTasksForUser = async (id: string) => {
  const response = await axiosInstance.get(
    `protected/tasks/getTaskForUser/${id}`
  );
  return response.data;
};

export const getUsersToAssign = async () => {
  await refreshPerformers();
  await refreshTasks();
  const response = await axiosInstance.get(`protected/users/getPerformers`,{
    headers: { "Cache-Control": "no-cache" },});
  return response.data;
};

export const createUser = async (formData: any) => {
  const response = await axiosInstance.post(`protected/tasks/createTask`, {
    formData,
  });
  return response.data;
};

export const getProfile = async (id: string) => {
  const response = await axiosInstance.get(
    `protected/users/getProfile/${id}`
  );
  return response.data;
};

export const updatePassword = async (formData: any) => {
  const response = await axiosInstance.patch(`protected/users/updatePassword`, {
    formData,
  });
  return response.data;
};

export const updateTask = async (formData: any) => {
  const response = await axiosInstance.patch(`protected/tasks/updateTask/${formData.taskId}`, {
    formData,
  });
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await axiosInstance.delete(`protected/tasks/deleteTask/${taskId}`);
  return response.data;
};
