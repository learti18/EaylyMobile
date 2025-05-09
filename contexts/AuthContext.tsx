import api from "@/services/auth/api";
import { setupInterceptors } from "@/services/auth/setupInterceptors";
import { clearTokens, setTokens } from "@/services/auth/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setupInterceptors(logout);

    const checkAuthentication = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      setIsAuthenticated(!!accessToken);
    };

    checkAuthentication();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });
      await setTokens(data.accessToken, data.refreshToken);
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Invalid username or password",
      });
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await clearTokens();
      setIsAuthenticated(false);
      router.replace("(auth)/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "An error occurred while logging out",
      });
      throw new Error("Logout failed");
    }
  };

  const register = async (
    username: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        phone,
        password,
        confirmPassword,
      });
      await setTokens(data.accessToken, data.refreshToken);
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: "Please try again",
      });
      throw new Error("Register failed");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
