import { apiEndpoints } from "@/utils/endpoints";
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.post(apiEndpoints.auth.login, {
          password: import.meta.env.VITE_TMP_PASSWORD,
          email: import.meta.env.VITE_TMP_EMAIL,
        });
        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("token", newAccessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        toast.error("Session expired. Please log in again.");
        // Optional: redirect to login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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
