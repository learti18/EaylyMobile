import CategoryButton from "@/components/buttons/CategoryButton";
import RestaurantCard from "@/components/cards/RestaurantCard";
import Header from "@/components/generic/header";
import SearchBar from "@/components/inputs/SearchBar";
import { useFetch } from "@/hooks/useFetch";
import {
  getRestaurantCategories,
  getRestaurants,
} from "@/services/restaurants/restaurantsService";
import { SlidersHorizontal } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
  } = useFetch<Restaurant[]>(() => getRestaurants());
  const {
    data: restaurantCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch<Category[]>(() => getRestaurantCategories());

  const filterRestaurants = (
    restaurants: Restaurant[] | null,
    categoryId: number | null,
    query: string
  ): Restaurant[] => {
    if (!restaurants) return [];

    let filtered = [...restaurants];

    if (categoryId !== null && categoryId !== 0) {
      const selectedCategory = restaurantCategories?.find(
        (cat) => cat.id === categoryId
      );
      if (selectedCategory) {
        filtered = filtered.filter(
          (restaurant) => restaurant.category === selectedCategory.name
        );
      }
    }

    if (query.trim() !== "") {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    const filtered = filterRestaurants(restaurants, activeCategory, text);
    setFilteredRestaurants(filtered);
  };

  const handleCategoryPress = (categoryId: number): void => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      const filtered = filterRestaurants(restaurants, null, searchQuery);
      setFilteredRestaurants(filtered);
    } else {
      setActiveCategory(categoryId);
      const filtered = filterRestaurants(restaurants, categoryId, searchQuery);
      setFilteredRestaurants(filtered);
    }
  };

  useEffect(() => {
    if (restaurants) {
      const filtered = filterRestaurants(
        restaurants,
        activeCategory,
        searchQuery
      );
      setFilteredRestaurants(filtered);
    }
  }, [restaurants]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* header section */}
        <Header />

        {/* search and filtering section */}
        <View className="flex-row gap-x-4 mt-10 px-5">
          <SearchBar
            placeholder="Search for restaurants"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View className="items-center justify-center px-4 rounded-2xl bg-primary-500">
            <SlidersHorizontal color="#ffff" size={30} weight="regular" />
          </View>
        </View>

        {/* categories section */}
        <View className="mt-10">
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
                  onPress={() => handleCategoryPress(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }}
              className="flex-grow"
            />
          )}
        </View>

        <View className="mt-10">
          {restaurantsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : restaurantsError ? (
            <Text className="text-red-500">
              Error: {restaurantsError?.message}
            </Text>
          ) : (
            <View className="pb-10">
              <Text className="font-semibold text-gray-800 text-3xl mb-8 px-5">
                {activeCategory === null || activeCategory === 0
                  ? "Nearby Restaurants"
                  : restaurantCategories?.find(
                      (cat) => cat.id === activeCategory
                    )?.name || "Restaurants"}
              </Text>
              {/* Show debug info for development */}
              {/* <Text className="px-5 mb-2 text-gray-500">
                Found {filteredRestaurants.length} restaurant(s) 
                {activeCategory !== null ? ` in category ${activeCategory}` : ""}
              </Text> */}
              <FlatList
                data={filteredRestaurants}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={({ item }) => <RestaurantCard {...item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 15,
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
