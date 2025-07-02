import Star from "@/assets/icons/Star.svg";
import { useAddToCart } from "@/queries/useCart";
import {
  useAddToFavourite,
  useRemoveFavouriteItem,
} from "@/queries/useFavourite";
import { router } from "expo-router";
import { Heart } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
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
  restaurantId: number;
}

const FoodCard = ({
  id,
  name,
  imageUrl,
  averagePreparationTime,
  isFavorite,
  price,
  restaurantId,
}: FoodProps) => {
  const [dollars, cents] = price.toFixed(2).split(".");
  const isInitialRender = useRef(true);

  const { mutate: addToFavouritesMutation } = useAddToFavourite();
  const { mutate: removeFromFavouritesMutation } = useRemoveFavouriteItem();
  const [favorite, setFavorite] = useState(isFavorite);
  const { mutate: addToFavourites, isPending: isAddingToFavourites } =
    useAddToFavourite();
  const { mutate: removeFromFavourites, isPending: isRemovingFromFavourites } =
    useRemoveFavouriteItem();

  // Use useEffect to update favorite when prop changes
  useEffect(() => {
    if (isFavorite !== favorite) {
      setFavorite(isFavorite);
    }
  }, [isFavorite]);

  const handleToggleFavorite = (e?: any) => {
    // Stop propagation if event exists
    if (e) {
      e.stopPropagation();
    }

    // Prevent multiple clicks while an operation is in progress
    if (isAddingToFavourites || isRemovingFromFavourites) {
      return;
    }

    // Optimistic UI update
    setFavorite(!favorite);

    if (favorite) {
      removeFromFavourites(id);
    } else {
      addToFavourites(id);
    }
  };

  const {
    mutate: addToCartMutation,
    isPending: isAddingToCart,
    isError,
  } = useAddToCart();

  const handleAddToCart = async () => {
    try {
      addToCartMutation({
        foodId: id,
        quantity: 1,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add item to cart",
        text2:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "An error occurred while adding the item.",
      });
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (favorite) {
      addToFavouritesMutation(id);
    } else {
      removeFromFavouritesMutation(id);
    }
  }, [favorite]);

  return (
    <Pressable
      className="relative bg-white rounded-[34.58px] py-2 px-5"
      onPress={() =>
        router.push(`/home/details/${id}?restaurantId=${restaurantId}`)
      }
      style={{
        flex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 2,
        maxWidth: "48%",
      }}
    >
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          handleToggleFavorite();
        }}
        className="absolute top-5 right-5 p-2.5 -m-2.5"
        disabled={isAddingToFavourites || isRemovingFromFavourites}
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
          {isAddingToCart ? (
            <Text className="text-white text-lg font-bold leading-none">
              ...
            </Text>
          ) : (
            <Text className="text-white text-2xl font-bold leading-none">
              +
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default FoodCard;
