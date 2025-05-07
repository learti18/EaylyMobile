import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const profile = () => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>profile</Text>
    </View>
  );
};

export default profile;
