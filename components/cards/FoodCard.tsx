import Star from "@/assets/icons/Star.svg";
import { useFetch } from "@/hooks/useFetch";
import { addToCart } from "@/services/cart/cartService";
import { Heart } from "phosphor-react-native";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface FoodProps {
  id: number;
  name: string;
  imageUrl: string;
  averagePreparationTime: number;
  type: string;
  isFavorite: boolean;
  price: number;
}

const FoodCard = ({
  id,
  name,
  imageUrl,
  averagePreparationTime,
  type,
  isFavorite,
  price,
}: FoodProps) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [dollars, cents] = price.toFixed(2).split(".");
  const {
    data: cartData,
    loading: isAddingToCart,
    refetch: refetchAddToCart,
    error: addToCartError,
  } = useFetch(() => addToCart(id, 1), false);

  const handleAddToCart = async () => {
    await refetchAddToCart();
    if (addToCartError) {
      Toast.show({
        type: "error",
        text1: "Error adding to cart",
        text2: addToCartError.message,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Added to cart",
        text2: `${name} has been added to your cart.`,
      });
    }
  };

  return (
    <Pressable
      className="relative bg-white rounded-[34.58px] py-2 px-5"
      style={{
        flex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 2,
        maxWidth: "48%", // This ensures we have room for the gap
      }}
    >
      <TouchableOpacity
        onPress={() => setFavorite((prev) => !prev)}
        className="absolute top-5 right-5 p-2.5 -m-2.5"
      >
        <Heart
          size={30}
          weight={favorite ? "fill" : "regular"}
          color={favorite ? "#6C5FBC" : "#111827"}
        />
      </TouchableOpacity>

      <View className="pt-8 justify-center items-center mx-auto">
        <Image
          source={{ uri: imageUrl }}
          className="w-36 h-36 rounded-full" // Slightly smaller to fit better
          resizeMode="cover"
        />
      </View>

      <Text className="font-semibold text-2xl pt-1" numberOfLines={1}>
        {name}
      </Text>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-gray-400">{averagePreparationTime}min •</Text>
        <View className="flex-row items-center gap-1">
          <Star width={20} height={20} />
          <Text className="text-gray-400">4.5</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 pb-5">
        <Text className="text-gray-900 text-2xl font-semibold pt-2">
          ${dollars}
          <Text className="text-gray-500 text-lg">.{cents}</Text>
        </Text>
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-black flex items-center justify-center px-3 py-1 rounded-[9px]"
          style={{ minWidth: 36, height: 36 }}
        >
          <Text className="text-white text-2xl font-bold leading-none">+</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default FoodCard;
