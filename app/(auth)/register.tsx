import Logo from "@/assets/icons/Logo.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import IconInput from "@/components/inputs/IconInput";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, Lock, Phone, User } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const handleFocus = (y) => {
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true,
    });
  };

  return (
    <SafeAreaView className="bg-background-500 flex flex-1">
      <View className="absolute w-64 h-64 bg-primary-100 rounded-full -top-20 -right-20 opacity-50" />
      <View className="absolute w-64 h-64 bg-primary-100 rounded-full -bottom-20 -left-20 opacity-50" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-4"
        >
          <View className="flex-1 items-center justify-center px-6">
            <Logo width={110} height={110} />

            <View className="w-full max-w-sm mt-5 items-center">
              <View className="flex flex-col items-center justify-center gap-3 mb-8">
                <Text className="text-4xl font-extrabold text-primary-500 text-center">
                  Create Account
                </Text>
                <Text className="text-gray-500 text-center px-6">
                  Join our community of food lovers and discover amazing
                  restaurants
                </Text>
              </View>

              <View className="flex flex-col gap-4 w-full ">
                <IconInput
                  icon={User}
                  placeholder="Email"
                  keyboardType="email-address"
                />
                <IconInput
                  icon={Phone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
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
              </View>

              <ButtonHighlight
                text="Create Account"
                variant="primary"
                className="mt-6"
                onPress={() => {
                  console.log("Register button pressed");
                }}
              />

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-gray-500">Already have an account?</Text>
                <Pressable onPress={() => router.push("/login")}>
                  <Text className="text-primary-500 font-semibold ml-2">
                    Login
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

export default Register;
