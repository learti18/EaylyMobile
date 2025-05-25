import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import toastConfig from "@/components/toastConfig";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
export default function RootLayout() {
  const { hasSeenOnboarding, isLoading: onboardingLoading } = useOnboarding();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AuthProvider>
        <InnerLayout
          hasSeenOnboarding={hasSeenOnboarding}
          isLoading={onboardingLoading}
        />
      </AuthProvider>
    </PersistQueryClientProvider>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
        </Stack>
        <Toast config={toastConfig} />
      </>
    </GestureHandlerRootView>
  );
};
