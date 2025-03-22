import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (!error.response) {
      toast.error("Network error, please try again.");
    } else if (error.response.status === 401) {
      toast.error("Unauthorized. Please login.");
    } else if (error.response.status === 404) {
      toast.error("Resource not found.");
    } else {
      toast.error(error.response.data?.message || "An error occurred.");
    }
    return Promise.reject(error);
  }
);

export { apiClient };
