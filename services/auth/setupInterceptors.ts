import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { refreshToken } from "./tokenService";

let interceptorsAreSetup = false;

export const setupInterceptors = (onLogout: () => Promise<void>) => {
  if (interceptorsAreSetup) {
    return;
  }
  interceptorsAreSetup = true;

  api.interceptors.request.use(
    async (config) => {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      config.headers["X-Client"] = "mobile";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshToken(onLogout);
          return api(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );
};
