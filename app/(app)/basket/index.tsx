import { useFetch } from "@/hooks/useFetch";
import { getCart } from "@/services/cart/cartService";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Basket = () => {
  const router = useRouter();
  const {
    data: cartData,
    loading: isCartLoading,
    error: cartError,
  } = useFetch(() => getCart());

  return (
    <View className="flex justify-center items-center w-full flex-1">
      {isCartLoading ? (
        <Text className="text-gray-500">Loading your basket...</Text>
      ) : cartError ? (
        <Text className="text-red-500">Error: {cartError.message}</Text>
      ) : (
        <>
          <Text className="text-2xl font-bold mb-4">Your Basket</Text>
          {cartData && cartData.cartItems.length > 0 ? (
            cartData.cartItems.map((item) => (
              <View key={item.id} className="mb-4">
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-gray-500">
                  Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500">Your basket is empty.</Text>
          )}
        </>
      )}
    </View>
  );
};

export default Basket;
