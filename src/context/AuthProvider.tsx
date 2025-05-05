import { getCurrentUserData } from "@/api/authApi";
import { IUser } from "@/interface/IUser";
import { apiEndpoints } from "@/utils/endpoints";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string) => {
    return true;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
