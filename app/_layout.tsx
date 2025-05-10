import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { hasSeenOnboarding, isLoading: onboardingLoading } = useOnboarding();

  return (
    <AuthProvider>
      <InnerLayout
        hasSeenOnboarding={hasSeenOnboarding}
        isLoading={onboardingLoading}
      />
    </AuthProvider>
  );
}

type InnerLayoutProps = {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
};

const InnerLayout = ({ hasSeenOnboarding, isLoading }: InnerLayoutProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const isAppLoading = isLoading || authLoading;

  useEffect(() => {
    if (!isAppLoading) {
      SplashScreen.hideAsync();
    }
  }, [authLoading, isLoading]);

  useEffect(() => {
    if (!isAppLoading) {
      if (!isAuthenticated) {
        if (!hasSeenOnboarding) {
          router.replace("/(onboarding)");
        } else {
          router.replace("/(auth)/login");
        }
      } else {
        router.replace("/home");
      }
    }
  }, [isAppLoading, isAuthenticated, hasSeenOnboarding]);

  if (authLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-500">
        <ActivityIndicator size="large" color="#6c5fbc" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
      </Stack>
      <Toast
        position="top"
        visibilityTime={2000}
        autoHide
        topOffset={50}
        bottomOffset={40}
        style={{ zIndex: 9999 }}
      />
    </>
  );
};
