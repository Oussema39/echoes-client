import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { IUser } from "@/interface/IUser";

export const getCurrentUserData = async (): Promise<IUser | null> => {
  const res = await apiClient.get(apiEndpoints.auth.me, {
    withCredentials: true,
  });
  const userData = res.data.data ?? res.data;
  return userData;
};

export const logoutUser = async (): Promise<IUser | null> => {
  const res = await apiClient.post(apiEndpoints.auth.logout, {
    // withCredentials: true,
  });
  const userData = res.data.data ?? res.data;
  return userData;
};
