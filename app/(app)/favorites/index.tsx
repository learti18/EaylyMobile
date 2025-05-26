import FoodCard from '@/components/cards/FoodCard';
import Header from '@/components/generic/header';
import { useFetchFavourites } from '@/queries/useFavourite';
import {
  MagnifyingGlass
} from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


const FavoritesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');

  const categories = [
    { name: 'All', icon: '✨', color: 'bg-purple-100' },
    { name: 'Pizza', icon: '🍕', color: 'bg-orange-100' },
    { name: 'Asian', icon: '🍣', color: 'bg-red-100' },
  ];

  const { data: favouriteItems } = useFetchFavourites();

  const mappedFavoriteItems = useMemo(() => {
    return favouriteItems?.map((restaurant: any) => ({
      id: restaurant.id.toString(),
      name: restaurant.name,
      image: restaurant.imageUrl,
      category: restaurant.category,
      price: restaurant.price,
      averagePreparationTime: restaurant.averagePreparationTime,
      type: restaurant.type,
      isFavorite: true,
    }));
  }, [favouriteItems]);

  const filteredFavoriteItems = useMemo(() => {
    let items = mappedFavoriteItems;

    if (selectedCategory && selectedCategory !== 'All') {
      items = items?.filter((item: any) => item.category === selectedCategory);
    }

    if (searchText) {
      items = items?.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return items;
  }, [searchText, selectedCategory, mappedFavoriteItems]);

  useEffect(() => {
    console.log(favouriteItems);
  }, [favouriteItems]);

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pt-1 pb-5 bg-gray-100">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              onPress={() => setSelectedCategory(category.name)}
              className={`flex-row items-center px-4 py-2.5 rounded-2xl mr-2.5 shadow-sm 
                          ${category.color} 
                          ${selectedCategory === category.name ? 'border-2 border-purple-600' : 'border border-transparent'}`}>
              <Text className={`text-sm font-medium ${selectedCategory === category.name ? 'text-purple-700' : 'text-gray-700'}`}>{category.name}</Text>
              <Text className="text-base ml-1.5">{category.icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Content Area */}
        <View className=" z-10 pt-2.5">
          <Text className="text-2xl font-bold text-gray-800 px-5 pt-2.5 pb-4">Most Favourite</Text>
          <View className="flex-row flex-wrap justify-between px-5 pt-1">
            {filteredFavoriteItems?.length && filteredFavoriteItems?.length > 0 ? (
              filteredFavoriteItems?.map((item: Food) => (
                <FoodCard
                  key={item.id}
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
