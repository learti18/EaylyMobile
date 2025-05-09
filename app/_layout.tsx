import { AuthProvider } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import "./globals.css";

SplashScreen.preventAutoHideAsync();
const isAuthenticated = false;

export default function RootLayout() {
  const router = useRouter();
  const { hasSeenOnboarding, isLoading } = useOnboarding();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-500">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        ) : isAuthenticated ? (
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
      <Toast
        position="top"
        visibilityTime={2000}
        autoHide={true}
        topOffset={50}
        bottomOffset={40}
        style={{ zIndex: 9999 }}
      />
    </AuthProvider>
  );
}
