import CategoryButton from '@/components/buttons/CategoryButton';
import FoodCard from '@/components/cards/FoodCard';
import Header from '@/components/generic/header';
import { useFetchFavourites } from '@/queries/useFavourite';
import { useGetRestaurantCategories } from '@/queries/useRestaurant';
import {
  MagnifyingGlass
} from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

const FavoritesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');

  const { data: restaurantCategories } = useGetRestaurantCategories();
  const { data: favouriteItems, refetch: refetchFavourites } = useFetchFavourites();

  const removeDuplicateFavourites = (items: any[]) => {
    if (!items || !Array.isArray(items)) return [];
    
    const seen = new Set();
    return items.filter((item) => {
      if (!item || !item.id) return false;
      const duplicate = seen.has(item.id);
      seen.add(item.id);
      return !duplicate;
    });
  };

  const categories = [
    ...(restaurantCategories ?? []),
    {
      id: 0,
      name: 'All',
      imageUrl: '',
    },
  ];

  const mappedFavoriteItems = useMemo(() => {
    const rawItems = favouriteItems?.favouriteItems || favouriteItems || [];
    
    return rawItems?.map((food: any) => ({
      id: food.id.toString(),
      name: food.name,
      imageUrl: food.imageUrl,
      category: food.category,
      price: food.price,
      averagePreparationTime: food.averagePreparationTime,
      type: food.type,
      isFavorite: true,
      restaurantId: food.restaurantId,
    }));
  }, [favouriteItems]);

  const filteredFavoriteItems = useMemo(() => {
    let items = mappedFavoriteItems || [];

    if (selectedCategory && selectedCategory !== 'All') {
      items = items.filter((item: any) => item.category === selectedCategory);
    }

    if (searchText) {
      items = items.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return items;
  }, [searchText, selectedCategory, mappedFavoriteItems]);

  useEffect(() => {
    refetchFavourites();
  }, []);


  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <Header />

        {/* Search Section */}
        <View className="flex-row px-5 py-4 items-stretch bg-gray-100">
          <View className="flex-1 flex-row bg-white rounded-xl px-4 py-2 items-center mr-2.5 shadow-sm">
            <MagnifyingGlass size={22} color="#AAA" />
            <TextInput
              placeholder="Search Favourites..."
              className="ml-2.5 text-base flex-1 text-gray-800"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Categories Scroll */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <CategoryButton
              category={item}
              isActive={selectedCategory === item.name}
              onPress={() => setSelectedCategory(item.name)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }}
          className="flex-grow"
        />

        {/* Main Content Area */}
        <View className=" z-10 pt-2.5">
          <Text className="text-2xl font-bold text-gray-800 px-5 pt-2.5 pb-4">Most Favourite</Text>
          <View className="flex-row flex-wrap justify-between px-5 pt-1">
            {filteredFavoriteItems?.length && filteredFavoriteItems?.length > 0 ? (
              filteredFavoriteItems?.map((item: any, index: number) => (
                <FoodCard
                  key={index}
                  restaurantId={item.restaurantId}
                  id={item.id}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  averagePreparationTime={item.averagePreparationTime}
                  type={item.type}
                  isFavorite={true}
                  price={item.price} />
              ))
            ) : (
              <Text className="text-center text-gray-500 w-full py-10">No items match your filter.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
