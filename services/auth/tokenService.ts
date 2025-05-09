import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import api from "./api";

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

const refreshToken = async (onLogout: () => Promise<void>) => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    await onLogout();
    Toast.show({
      type: "error",
      text1: "Session expired",
      text2: "Please log in again.",
    });
    throw new Error("No refresh token");
  }

  try {
    const { data } = await api.post("/auth/refresh-token", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = data;
    await setTokens(accessToken, newRefreshToken);
  } catch (error) {
    await clearTokens();
    await onLogout();

    Toast.show({
      type: "error",
      text1: "Session expired",
      text2: "Please log in again.",
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
