import { LoginFormData } from "@/schemas/auth/loginSchemta";
import { RegisterFormData } from "@/schemas/auth/registerSchema";
import api from "@/services/auth/api";
import { getDeviceId } from "@/services/auth/deviceService";
import { setupInterceptors } from "@/services/auth/setupInterceptors";
import {
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/services/auth/tokenService";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setupInterceptors(logout);

    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        const accessToken = await getAccessToken();
        setIsAuthenticated(!!accessToken);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setHasCheckedAuth(true);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const deviceId = await getDeviceId();
      const { data: responseData } = await api.post("/mobile/auth/login", {
        email: data.email,
        password: data.password,
        deviceId,
      });

      await setTokens(responseData.token, responseData.refreshToken);
      setIsAuthenticated(true);

      router.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error.response?.data?.message || "Invalid credentials",
      });
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/mobile/auth/logout", {
        deviceId: await getDeviceId(),
      });

      await clearTokens();
      setIsAuthenticated(false);

      router.replace("/(auth)/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "An error occurred while logging out",
      });
      throw new Error("Logout failed");
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const deviceId = await getDeviceId();

      const { data: responseData } = await api.post("/mobile/auth/register", {
        email: data.email,
        phone: data.phone,
        password: data.password,
        deviceId,
      });

      await setTokens(responseData.token, responseData.refreshToken);
      setIsAuthenticated(true);

      router.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: "Unknown error",
      });
      throw new Error("Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        register,
        isLoading: !hasCheckedAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
