import { STORAGE_KEYS } from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface OnboardingHook {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
}

export const useOnboarding = (): OnboardingHook => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async (): Promise<void> => {
    try {
      const value = await AsyncStorage.getItem(
        STORAGE_KEYS.HAS_SEEN_ONBOARDING
      );
      setHasSeenOnboarding(value === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, "true");
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return {
    hasSeenOnboarding,
    isLoading,
    completeOnboarding,
  };
};
