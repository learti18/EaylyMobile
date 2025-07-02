import Star from "@/assets/icons/Star.svg";
import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import { useAddToCart } from "@/queries/useCart";
import { useAddToFavourite, useRemoveFavouriteItem } from "@/queries/useFavourite";
import { useGetFoodById } from "@/queries/useFood";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Heart } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Ingridient {
    id: number;
    name: string;
}

function DetailsScreen() {
    const { id, restaurantId } = useLocalSearchParams<{ id: string, restaurantId: string }>();
    const { data: food, isLoading, error } = useGetFoodById(Number(id), Number(restaurantId));
    const [quantity, setQuantity] = useState(1);
    const [favorite, setFavorite] = useState(false);
    const { mutate: addToCart, isPending } = useAddToCart();
    const { mutate: addToFavouritesMutation } = useAddToFavourite();
    const { mutate: removeFromFavouritesMutation } = useRemoveFavouriteItem();

    useEffect(() => {
        if (food) {
            setFavorite(food.isFavorite);
        }
    }, [food]);

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
                className="bg-gray-100 rounded-xl p-2.5 mr-2.5"
            >
                <Text className="text-gray-600">{ingredient.name}</Text>
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
                <Text className="text-xl font-bold text-primary-500 min-w-[24px] text-center">{quantity}</Text>
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
        <View className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <View className="bg-[#E9E3FF] rounded-b-3xl items-center pb-6 pt-12 relative">
                    <View className="absolute left-6 top-12">
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={28} color="#6C5FBC" />
                        </TouchableOpacity>
                    </View>
                    <View className="absolute right-6 top-12">
                        <TouchableOpacity onPress={handleToggleFavorite}>
                            <Heart size={28} color={favorite ? "#6C5FBC" : "#A1A1AA"} weight={favorite ? "fill" : "regular"} />
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: food.imageUrl }}
                        className="w-48 h-48 rounded-full mt-4 border-4 border-white"
                    />
                </View>
                <View className="px-6 mt-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-3xl font-bold text-[#22223E]">{food.name}</Text>
                        {renderQuantitySelector()}
                    </View>
                    <View className="flex-row items-center mt-2 mb-2">
                        <Text className="text-gray-400 text-base">{food.averagePreparationTime}min</Text>
                        <Text className="text-gray-400 text-base mx-2">•</Text>
                        <Star width={18} height={18} />
                        <Text className="text-gray-400 text-base ml-1">4.5</Text>
                        <Text className="text-gray-400 text-base mx-2">•</Text>
                        <Text className="text-red-400 text-base">320 Kcal</Text>
                    </View>
                    <View className="mb-3">
                        <View className="self-start bg-[#F6C768] rounded-md px-2.5 py-0.5 mb-2">
                            <Text className="text-[#7C5C00] font-bold text-sm">Healthy</Text>
                        </View>
                        <Text className="font-bold text-lg mb-1 text-[#22223E]">Description</Text>
                        <Text className="text-gray-400 text-base leading-6">{food.type}</Text>
                    </View>
                    <Text className="font-bold text-lg mb-2 text-[#22223E]">Ingredients</Text>
                    <View className="flex-row mb-6">
                        {food.ingridients.map(renderIngredient)}
                    </View>
                    <View className="flex-row items-center justify-between mt-4">
                        <Text className="text-4xl font-bold text-[#22223E]">
                            ${Math.floor(food.price)}
                            <Text className="text-xl text-gray-400">.{food.price.toFixed(2).split(".")[1]}</Text>
                        </Text>
                        <View className="flex-1 ml-4">
                            <ButtonHighlight
                                text="Add To Cart"
                                onPress={handleAddToCart}
                                isLoading={isPending}
                                className="py-2"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default DetailsScreen;