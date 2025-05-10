import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { Platform } from "react-native"; // Import Platform from React Native

const DEVICE_ID_KEY = "deviceId";

export const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    if (Device.isDevice) {
      if (Platform.OS === "web") {
        // For web, generate a dummy device ID or use a fallback
        deviceId = `web-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 11)}`;
      } else {
        // For native devices (Android/iOS)
        deviceId = Device.deviceName
          ? `${Device.deviceName}-${Device.modelName}-${Application.applicationId}`
          : Application.getAndroidId() ||
            Application.applicationId ||
            `eatly-${Date.now()}`;
      }
    } else {
      // Simulator / Emulator
      deviceId = `simulator-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 11)}`;
    }

    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
};
