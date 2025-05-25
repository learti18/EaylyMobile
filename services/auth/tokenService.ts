import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import api from "./api";
import { getDeviceId } from "./deviceService";

const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("accessToken");
};

const setTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("refreshToken");
};

const clearTokens = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};

let isRefreshing = false;
let refreshPromise = null;

const refreshToken = async (onLogout: () => Promise<void>) => {
  // If already refreshing, return the existing promise to avoid duplicate requests
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;

  try {
    refreshPromise = _refreshToken(onLogout);
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const _refreshToken = async (onLogout: () => Promise<void>) => {
  const refreshTokenValue = await getRefreshToken();
  if (!refreshTokenValue) {
    console.log("No refresh token found, logging out");
    await clearTokens();
    await onLogout();
    throw new Error("No refresh token");
  }

  try {
    console.log("Attempting to refresh token");

    const refreshApi = axios.create({
      baseURL: api.defaults.baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Client": "mobile",
      },
    });

    const deviceId = await getDeviceId();
    const { data } = await refreshApi.post("/mobile/auth/refresh-token", {
      refreshToken: refreshTokenValue,
      deviceId,
    });

    console.log("Token refresh response received");

    if (!data.token || !data.refreshToken) {
      console.error("Invalid token refresh response format:", data);
      throw new Error("Invalid token response");
    }

    const { token: accessToken, refreshToken: newRefreshToken } = data;
    await setTokens(accessToken, newRefreshToken);

    console.log("Tokens successfully updated");
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("Token refresh failed:", error);
    await clearTokens();
    await onLogout();

    Toast.show({
      type: "error",
      text1: "Session expired",
      text2: "Please log in again.",
      position: "bottom",
      visibilityTime: 2000,
    });

    throw error;
  }
};

export {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  refreshToken,
  setTokens,
};
