import axiosInstance from "./axiosInstance";

export const getTasksByUser = async (id: string) => {
  const response = await axiosInstance.get(`protected/tasks/getTaskByUser/${id}`);
  return response.data;
};
