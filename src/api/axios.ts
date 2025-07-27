import { normalizeUrl } from "@/lib/utils";
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
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    config.url = normalizeUrl(config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url;

    if (url && url.includes("/auth")) {
      // Skip toast or handle auth errors differently
      return Promise.reject(error);
    }

    // Other error handling
    if (!error.response) {
      toast.error("Network error, please try again.");
    } else if (error.response.status === 404) {
      toast.error("Resource not found.");
    } else {
      toast.error(error.response.data?.message || "An error occurred.");
    }

    return Promise.reject(error);
  }
);

export { apiClient };
