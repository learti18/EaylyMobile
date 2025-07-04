import { CartItem } from "@/types/cart/cart";
import React from "react";
import { Image, Text, View } from "react-native";

const OrderItem = ({ foodImageUrl, foodName, quantity, price }: CartItem) => {
  return (
    <View className="flex-row justify-between items-center mb-3 border-b border-gray-100 pb-3">
      <View className="flex-row items-center">
        {foodImageUrl && (
          <Image
            source={{ uri: foodImageUrl }}
            className="h-14 w-14 rounded-lg mr-3"
            resizeMode="contain"
          />
        )}
        <View>
          <Text className="font-medium text-base">{foodName}</Text>
          <Text className="text-sm text-gray-500">Qty: {quantity}</Text>
        </View>
      </View>
      <Text className="font-medium text-base">
        ${(price * quantity).toFixed(2)}
      </Text>
    </View>
  );
};

export default OrderItem;
