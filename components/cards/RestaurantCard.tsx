import Star from "@/assets/icons/Star.svg";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import Badge, { BadgeType } from "../generic/badge";

const RestaurantCard = ({
  id,
  name,
  imageUrl,
  foodType,
  averagePreparationTime,
}: Restaurant) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/home/restaurants/${id}`)}
      style={{
        width: 300,
        marginRight: 15,
        borderRadius: 30,
        backgroundColor: "white",
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.05,
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
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        />
        <View className="p-4">
          <Badge type={foodType as BadgeType} />
          <Text className="text-2xl font-semibold capitalize">{name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-gray-400">
              {Math.round(averagePreparationTime)}min •
            </Text>
            <View className="flex-row items-center">
              <Star width={20} height={20} />
              <Text className="text-gray-400">4.5</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
