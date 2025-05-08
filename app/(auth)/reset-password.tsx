import Logo from "@/assets/icons/Logo.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import IconInput from "@/components/inputs/IconInput";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, Lock } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
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
          className="px-4"
        >
          <View className="flex-1 items-center justify-center px-6">
            <Logo width={110} height={110} />

            <View className="w-full max-w-sm mt-5 items-center">
              <View className="flex flex-col items-center justify-center gap-3 mb-8">
                <Text className="text-4xl font-extrabold text-primary-500 text-center">
                  Reset Password
                </Text>
                <Text className="text-gray-500 text-center px-6">
                  Please enter your new password to reset your account
                </Text>
              </View>
              <View className="flex flex-col gap-4 w-full">
                <IconInput
                  icon={Lock}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  rightIcon={
                    showPassword ? (
                      <Eye size={24} color="#9CA3AF" weight="bold" />
                    ) : (
                      <EyeSlash size={24} color="#9CA3AF" weight="bold" />
                    )
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
                <IconInput
                  icon={Lock}
                  placeholder="Confirm Password"
                  secureTextEntry={!showPassword}
                  rightIcon={
                    showPassword ? (
                      <Eye size={24} color="#9CA3AF" weight="bold" />
                    ) : (
                      <EyeSlash size={24} color="#9CA3AF" weight="bold" />
                    )
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />

                <ButtonHighlight
                  text="Reset Password"
                  variant="primary"
                  className="mt-6"
                  onPress={() => router.push("/login")}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;
