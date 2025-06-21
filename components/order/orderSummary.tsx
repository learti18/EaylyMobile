import React from "react";
import { Text, View } from "react-native";
import OrderItem from "./orderItem";

interface CartItem {
  id: number;
  foodName: string;
  foodImageUrl?: string;
  quantity: number;
  price: number;
}

interface Cart {
  cartItems: CartItem[];
}

interface OrderSummaryProps {
  cart: Cart;
  subtotal: number;
  deliveryFee: number;
  total: string;
}

export default function OrderSummary({
  cart,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  const tax = (subtotal * 0.07).toFixed(2);

  return (
    <View className="bg-white rounded-xl p-4 mb-6">
      <Text className="text-lg font-semibold mb-4">Order Summary</Text>

      {cart.cartItems.map((item) => (
        <OrderItem key={item.id} {...item} />
      ))}

      <View className="border-t border-gray-200 pt-5 gap-3 mt-3">
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="text-gray-600 font-medium">
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Delivery Fee</Text>
          <Text className="text-gray-600 font-medium">
            ${deliveryFee.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Tax (7%)</Text>
          <Text className="text-gray-600 font-medium">${tax}</Text>
        </View>
        <View className="flex-row justify-between pt-3 mt-1 border-t border-gray-200">
          <Text className="font-bold text-lg">Total</Text>
          <Text className="font-bold text-lg text-purple">${total}</Text>
        </View>
      </View>
    </View>
  );
}
