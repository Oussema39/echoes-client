import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { IUser } from "@/interface/IUser";
import { UserData } from "@/context/AuthProvider";

type LoginUserResponse = {
  user: IUser;
  accessToken: string;
  refreshToken: string;
};
type RegisterUserResponse = LoginUserResponse;

export const getCurrentUserData = async (): Promise<IUser | null> => {
  const res = await apiClient.get(apiEndpoints.auth.me, {
    withCredentials: true,
  });
  const userData = res.data.data ?? res.data;
  return userData;
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<LoginUserResponse | null> => {
  const res = await apiClient.post(apiEndpoints.auth.login, payload, {
    withCredentials: true,
  });
  const userData = res.data.data ?? res.data;
  return userData;
};

export const logoutUser = async (): Promise<IUser | null> => {
  const res = await apiClient.post(apiEndpoints.auth.logout, {
    withCredentials: true,
  });
  const userData = res.data.data ?? res.data;
  return userData;
};

export const registerUser = async (
  data: UserData
): Promise<RegisterUserResponse | null> => {
  const res = await apiClient.post(apiEndpoints.auth.register, data);
  const userData = res.data.data ?? res.data;
  return userData;
};
