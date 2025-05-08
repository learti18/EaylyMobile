import Logo from "@/assets/icons/Logo.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import IconInput from "@/components/inputs/IconInput";
import { useRouter } from "expo-router";
import { User } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <SafeAreaView className="bg-background-500 flex flex-1">
      <View className="absolute w-64 h-64 bg-primary-100 rounded-full -top-20 -right-20 opacity-50" />
      <View className="absolute w-64 h-64 bg-primary-100 rounded-full -bottom-20 -left-20 opacity-50" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6">
            <Logo width={110} height={110} />

            <View className="w-full max-w-sm items-center mt-5">
              <View className="flex flex-col items-center justify-center gap-3 mb-8">
                <Text className="text-4xl font-extrabold text-primary-500 text-center">
                  Forget Password
                </Text>
                <Text className="text-gray-500 text-center px-6">
                  Please enter your email to receive a password reset link
                </Text>
              </View>

              <View className="flex flex-col gap-4 w-full items-center">
                <IconInput
                  icon={User}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>

              <ButtonHighlight
                text="Next"
                variant="primary"
                className="mt-6"
                onPress={() => router.push("/reset-password")}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
