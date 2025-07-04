import Star from "@/assets/icons/Star.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import Badge, { BadgeType } from "@/components/generic/badge";
import { useAddToCart } from "@/queries/useCart";
import {
  useAddToFavourite,
  useRemoveFavouriteItem,
} from "@/queries/useFavourite";
import { useGetFoodById } from "@/queries/useFood";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Heart } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Ingridient {
  id: number;
  name: string;
  backgroundColor?: string;
  imageUrl?: string;
}

function DetailsScreen() {
  const { id, restaurantId } = useLocalSearchParams<{
    id: string;
    restaurantId: string;
  }>();
  const foodId = Number(id);
  const restId = Number(restaurantId);
  const { data: food, isLoading, error } = useGetFoodById(foodId, restId);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { mutate: addToFavouritesMutation, isPending: isAddingToFavourites } =
    useAddToFavourite();
  const {
    mutate: removeFromFavouritesMutation,
    isPending: isRemovingFromFavourites,
  } = useRemoveFavouriteItem();

  useEffect(() => {
    if (food?.isFavorite !== undefined) {
      setFavorite(food.isFavorite);
    }
  }, [food?.isFavorite]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#6C5FBC" />;
  }

  if (error || !food) {
    return <Text>Error: {error?.message || "Food not found"}</Text>;
  }

  function handleAddToCart() {
    addToCart({ foodId: food!.id, quantity });
  }

  function handleIncrease() {
    setQuantity((q) => q + 1);
  }

  function handleDecrease() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }

  function handleToggleFavorite() {
    if (!food) return;

    if (isAddingToFavourites || isRemovingFromFavourites) {
      return;
    }

    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);

    if (newFavoriteState) {
      addToFavouritesMutation(food.id);
    } else {
      removeFromFavouritesMutation(food.id);
    }
  }

  function renderIngredient(ingredient: Ingridient) {
    return (
      <View
        key={ingredient.id}
        className="bg-gray-100 rounded-xl w-14 h-14 flex items-center justify-center mr-2"
        style={{ backgroundColor: ingredient.backgroundColor || "#F3F4F6" }}
      >
        <Image
          source={{
            uri: ingredient.imageUrl || "https://via.placeholder.com/50",
          }}
          className="w-8 h-8"
        />
      </View>
    );
  }

  function renderQuantitySelector() {
    return (
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleDecrease}
          className="bg-primary-500 rounded-lg px-3 py-1 mr-2"
        >
          <Text className="text-white text-xl font-bold">-</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary-500 min-w-[24px] text-center">
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={handleIncrease}
          className="bg-primary-500 rounded-lg px-3 py-1 ml-2"
        >
          <Text className="text-white text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#E9E3FF]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        className="bg-gray-50"
      >
        <View className="flex-1 bg-[#E9E3FF] rounded-b-3xl items-center py-8 relative">
          <View className="w-full flex-row items-center justify-between px-6 mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={28} color="#6C5FBC" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              disabled={isAddingToFavourites || isRemovingFromFavourites}
            >
              <Heart
                size={32}
                color={favorite ? "#6C5FBC" : "#A1A1AA"}
                weight={favorite ? "fill" : "regular"}
              />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: food.imageUrl }}
            className="w-56 h-56 rounded-full"
            resizeMode="contain"
          />
        </View>
        <View className="px-6 mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-[#22223E]">
              {food.name}
            </Text>
            {renderQuantitySelector()}
          </View>
          <View className="flex-row items-center mt-4 mb-4">
            <Text className="text-gray-400 text-base">
              {food.averagePreparationTime}min
            </Text>
            <Text className="text-gray-400 text-base mx-2">•</Text>
            <Star width={18} height={18} />
            <Text className="text-gray-400 text-base ml-1">4.5</Text>
            <Text className="text-gray-400 text-base mx-2">•</Text>
            <Text className="text-red-400 text-base">{food.calories} Kcal</Text>
          </View>
          <View className="mb-4">
            <Badge type={food.type as BadgeType} />
            <Text className="font-semibold text-xl mt-3   text-[#22223E]">
              Description
            </Text>
            <Text className="text-gray-400 text-base leading-6">
              {food.slogan ||
                "This is a delicious food item that you will love. It is made with the finest ingredients and prepared with care to ensure the best taste."}
            </Text>
          </View>
          <Text className="font-semibold text-xl mb-2 text-[#22223E]">
            Ingredients
          </Text>
          <View className="flex-row mb-6">
            {food.ingridients.map(renderIngredient)}
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-4xl font-bold text-[#22223E]">
              ${Math.floor(food.price)}
              <Text className="text-xl text-gray-400">
                .{food.price.toFixed(2).split(".")[1]}
              </Text>
            </Text>
            <View className="flex-1 ml-6">
              <ButtonHighlight
                text="Add To Cart"
                onPress={handleAddToCart}
                isLoading={isPending}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DetailsScreen;
