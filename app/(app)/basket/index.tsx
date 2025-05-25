import CartCard from "@/components/cards/CartCard";
import Header from "@/components/generic/header";
import {
  useClearCart,
  useFetchCart,
  useRemoveCartItem,
} from "@/queries/useCart";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Basket = () => {
  const router = useRouter();
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
  } = useFetchCart();

  const {
    mutate: clearCartMutation,
    isPending: isClearingCart,
    isSuccess: isCartCleared,
    isError: isClearCartError,
  } = useClearCart();
  const { mutate: deleteItemMutation, isPending: isDeletingItem } =
    useRemoveCartItem();

  const handleClearCart = () => {
    clearCartMutation(undefined);
  };

  const handleDeleteItem = (foodId: number) => {
    deleteItemMutation(foodId);
  };

  const hasItems = cartData?.cartItems && cartData.cartItems.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background-100">
      <Header />

      {/* Main Content */}
      <View className="flex-1">
        {isCartLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">
              Loading your basket...
            </Text>
          </View>
        ) : cartError ? (
          <View className="flex-1 justify-center items-center px-5">
            <Text className="text-red-500 text-center">
              Error: {cartError.message}
            </Text>
          </View>
        ) : (
          <>
            {/* Header Section */}
            <View className="px-5 py-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  Your Basket
                </Text>
                {hasItems && (
                  <TouchableOpacity
                    onPress={handleClearCart}
                    className="px-3 py-1 rounded-lg bg-red-50"
                  >
                    <Text className="text-red-600 text-sm font-medium">
                      Clear All
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {hasItems && (
                <Text className="text-gray-500 mt-1">
                  {cartData.cartItems.length} item
                  {cartData.cartItems.length !== 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Items List */}
            <View className="flex-1 px-5">
              <FlatList
                data={cartData?.cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CartCard
                    {...item}
                    onDelete={() => handleDeleteItem(item.foodId)}
                  />
                )}
                contentContainerStyle={{
                  paddingTop: 16,
                  paddingBottom: hasItems ? 120 : 16, // Extra padding when there are items for the bottom bar
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View className="flex-1 items-center justify-center py-20">
                    <View className="items-center">
                      <Text className="text-xl font-semibold text-gray-800 mb-2">
                        Your basket is empty
                      </Text>
                      <Text className="text-gray-500 text-center mb-6 px-8">
                        Add some delicious items to get started
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push("/home")}
                        className="bg-primary-500 px-6 py-3 rounded-xl"
                      >
                        <Text className="text-white font-semibold">
                          Browse Menu
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>

            {/* Fixed Bottom Bar - Only show when there are items */}
            {hasItems && (
              <View className=" px-5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold text-gray-700">
                    Total
                  </Text>
                  <Text className="text-2xl font-bold text-primary-500">
                    ${cartData?.totalPrice.toFixed(2) || "0.00"}
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-primary-500 py-4 rounded-xl"
                  onPress={() => router.push("/basket/cart")}
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-lg font-semibold text-center">
                    Proceed to Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Basket;
