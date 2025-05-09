import Logo from "@/assets/icons/Logo.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import IconInput from "@/components/inputs/IconInput";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormData, loginSchema } from "@/schemas/auth/loginSchemta";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, Lock, User } from "phosphor-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const { login } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err) {}
  };

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
          <View className="flex-1 items-center justify-center">
            <Logo width={110} height={110} />

            <View className="w-full max-w-sm mt-5 items-center">
              <View className="flex flex-col items-center justify-center gap-3 mb-8">
                <Text className="text-4xl font-extrabold text-primary-500 text-center">
                  Login to your account
                </Text>
                <Text className="text-gray-500 text-center px-6">
                  Please enter your details to access your account
                </Text>
              </View>

              <View className="flex flex-col gap-4 w-full items-center">
                <IconInput
                  icon={User}
                  placeholder="Email"
                  keyboardType="email-address"
                  name="email"
                  error={errors.email?.message}
                  control={control}
                />
                <IconInput
                  icon={Lock}
                  placeholder="Password"
                  name="password"
                  control={control}
                  error={errors.password?.message}
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
                <View className="flex-row items-center pr-2 justify-end w-full">
                  <Pressable onPress={() => router.push("/forgot-password")}>
                    <Text className="text-gray-500 font-semibold">
                      Forgot Password?
                    </Text>
                  </Pressable>
                </View>
              </View>

              <ButtonHighlight
                text="Login"
                variant="primary"
                className="mt-6"
                onPress={handleSubmit(onSubmit)}
              />

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-gray-500">
                  Don&apos;t have an account?
                </Text>
                <Pressable onPress={() => router.push("/register")}>
                  <Text className="text-primary-500 font-semibold ml-2">
                    Register
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
