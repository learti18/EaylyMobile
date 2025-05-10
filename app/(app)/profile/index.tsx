import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const profile = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {}
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>profile</Text>
      <ButtonHighlight text="Logout" onPress={handleLogout} />
    </View>
  );
};

export default profile;
