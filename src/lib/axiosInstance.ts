import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies
});

// Add token dynamically in request interceptor
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authorization");
    if (token) {
      config.headers["Authorization"] = token;
    }
  }
  return config;
});

export default axiosInstance;
