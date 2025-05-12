import {
  getCurrentUserData,
  loginUser,
  logoutUser,
  registerUser,
} from "@/api/authApi";
import { IBase } from "@/interface/IBase";
import { IUser } from "@/interface/IUser";
import { apiEndpoints } from "@/utils/endpoints";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export type UserData = Omit<
  IUser,
  keyof IBase | "emailVerified" | "refreshToken"
>;
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<IUser | null>;
  register: (data: UserData) => Promise<IUser | null>;
  loginWithGoogle: () => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUserData();
        if (!userData) throw new Error("No user data found");

        setUser(userData);
        setIsAuthenticated(true);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithGoogle = async () => {
    window.location.href = `${BASE_URL}${apiEndpoints.auth.loginWithGoogle}`;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<IUser | null> => {
    try {
      const res = await loginUser({ email, password });
      const user = res?.user;

      // if (!user?.emailVerified) {
      //   throw new Error("User email unverified");
      // }

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error(error);
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    // setIsLoading(true);
    try {
      await logoutUser();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      throw new Error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const register = async (data: UserData): Promise<IUser | null> => {
    try {
      const res = await registerUser(data);
      const user = res?.user;

      // if (!user?.emailVerified) {
      //   throw new Error("User email unverified");
      // }

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error(error);
      setUser(null);
      return null;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    loginWithGoogle,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
