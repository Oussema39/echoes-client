import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { AxiosRequestConfig } from "axios";
import { IUser } from "@/interface/IUser";

export const getAllUsers = async (
  config: AxiosRequestConfig
): Promise<IUser[] | null> => {
  const res = await apiClient.get(apiEndpoints.users.getAll, config);
  const users = Array.isArray(res.data.data) ? res.data.data : [];
  return users;
};
