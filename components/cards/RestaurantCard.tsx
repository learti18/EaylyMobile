import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

const RestaurantCard = ({ id, name, imageUrl }: Restaurant) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/home/restaurants/${id}`)}
      style={{
        width: 300,
        marginRight: 15,
        borderRadius: 24,
        backgroundColor: "white",
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
          },
          android: {
            elevation: 6,
          },
        }),
      }}
    >
      <View className="overflow-hidden rounded-3xl">
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          className="w-full h-40"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        />
        <View className="p-4">
          <Text className="text-xl font-bold">{name}</Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-gray-400">24min</Text>
            <Text className="text-gray-400">4.5</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
