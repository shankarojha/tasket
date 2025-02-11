import axiosInstance from "./axiosInstance";

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
  const response = await axiosInstance.get(`protected/users/getPerformers`);
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
