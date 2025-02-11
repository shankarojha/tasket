import axiosInstance from "./axiosInstance";

export const getTasksByUser = async (id: string) => {
  const response = await axiosInstance.get(
    `protected/tasks/getTaskByUser/${id}`
  );
  return response.data;
};

export const getUsersToAssign = async () => {
  const response = await axiosInstance.get(`protected/users/getPerformers`);
  return response.data;
};

export const createUser = async (formData : any) => {
  const response = await axiosInstance.post(`protected/tasks/createTask`,{formData});
  return response.data;
};
