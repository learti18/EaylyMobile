import CategoryButton from "@/components/buttons/CategoryButton";
import RestaurantCard from "@/components/cards/RestaurantCard";
import Header from "@/components/generic/header";
import SearchBar from "@/components/inputs/SearchBar";
import { useFetch } from "@/hooks/useFetch";
import {
  getRestaurantCategories,
  getRestaurants,
} from "@/services/restaurants/restaurantsService";
import { useRouter } from "expo-router";
import { SlidersHorizontal } from "phosphor-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);

  const {
    data: restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
  } = useFetch(() => getRestaurants());
  const {
    data: restaurantCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(() => getRestaurantCategories());

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* header section */}
        <Header />

        {/* search and filtering section */}
        <View className="flex-row gap-x-4 mt-10 px-5">
          <SearchBar placeholder="Search for restaurants" value="" />
          <View className="items-center justify-center px-4 rounded-2xl bg-primary-500">
            <SlidersHorizontal color="#ffff" size={30} weight="regular" />
          </View>
        </View>

        {/* categories section */}
        <View className="mt-8">
          <Text className="font-bold text-2xl mb-3 px-5">Categories</Text>
          {categoriesLoading ? (
            <View className="px-5">
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : categoriesError ? (
            <View className="px-5">
              <Text className="text-red-500">
                Error: {categoriesError?.message}
              </Text>
            </View>
          ) : (
            <FlatList
              data={restaurantCategories}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              renderItem={({ item }) => (
                <CategoryButton
                  category={item}
                  isActive={activeCategory === item.id}
                  onPress={() => setActiveCategory(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }} // Padding left to match parent, reduced right padding
              className="flex-grow"
            />
          )}
        </View>

        <View className="mt-8">
          {restaurantsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : restaurantsError ? (
            <Text className="text-red-500">
              Error: {restaurantsError?.message}
            </Text>
          ) : (
            <View className="pb-10">
              <Text className="font-bold text-2xl mb-5 px-5">
                Nearby Restaurants
              </Text>
              <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={({ item }) => <RestaurantCard {...item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 15, // Increase bottom padding
                }}
                className="flex-grow"
                ListEmptyComponent={() => (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">No restaurants found</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
