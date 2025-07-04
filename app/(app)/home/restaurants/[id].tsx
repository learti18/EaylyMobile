import FoodCard from "@/components/cards/FoodCard";
import SearchBar from "@/components/inputs/SearchBar";
import { useGetFoodsByRestaurantId } from "@/queries/useRestaurant";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { CaretLeft, SlidersHorizontal } from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RestaurantDetails = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id, 10) : 0;
  const router = useRouter();
  const {
    data: foods,
    isLoading: foodsLoading,
    error: foodsError,
  } = useGetFoodsByRestaurantId(id);
  const HeaderComponent = () => (
    <View>
      <View className="flex-row items-center justify-between mt-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-3 rounded-2xl bg-white"
        >
          <CaretLeft size={24} />
        </TouchableOpacity>
        <Text className="text-2xl text-gray-400">Restaurant Details</Text>
      </View>

      {/* searchbar and filtering*/}
      <View className="flex-row gap-x-4 mt-8 mb-8">
        <SearchBar
          placeholder="Search for food"
          value=""
          onChangeText={() => {}}
        />
        <TouchableOpacity
          onPress={() => console.log("pressed")}
          className="items-center justify-center px-4 rounded-2xl bg-primary-500"
        >
          <SlidersHorizontal color="#ffff" size={30} weight="regular" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-100">
      {foodsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C5FBC" />
        </View>
      ) : foodsError ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-red-500">Error: {foodsError?.message}</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <FoodCard {...item} restaurantId={id} />}
          contentContainerStyle={{
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HeaderComponent}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
            gap: 16,
          }}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">
                This restaurant has no foods
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RestaurantDetails;
