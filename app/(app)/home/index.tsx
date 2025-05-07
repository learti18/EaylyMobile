import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-background-100]">
      <Text className="text-5xl text-primary-500 font-bold">
        Welcome to Eatly!
      </Text>
    </View>
  );
}
