import Header from '@/components/generic/header';
import { FavoriteItem } from '@/types/favourite-items';
import {
  Heart,
  MagnifyingGlass,
  Plus,
  SlidersHorizontal,
  Star
} from 'phosphor-react-native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FavoriteItemCard = ({ item }: { item: FavoriteItem }) => (
  <View className="w-[48%] bg-white rounded-xl p-2.5 mb-4 shadow-lg items-center">
    <Image
      source={{ uri: item.image }}
      className="w-30 h-30 rounded-xl mb-2.5"
      style={{ width: 120, height: 120 }}
    />
    <TouchableOpacity className="absolute top-3 right-3 bg-white/70 p-1 rounded-full">
      <Heart size={18} color="#8A2BE2" weight="regular" /> 
    </TouchableOpacity>
    {item.tag && 
      <View 
        className={`absolute top-[100px] left-3 px-2 py-1 rounded-lg ${item.tagColor === '#E0FFE0' ? 'bg-[#E0FFE0]' : item.tagColor === '#FFE0E0' ? 'bg-[#FFE0E0]' : 'bg-yellow-300'}`}>
        <Text className="text-xs font-bold text-gray-700">{item.tag}</Text>
      </View>
    }
    <Text className="text-base font-bold text-gray-800 text-center mb-1">{item.name}</Text>
    <View className="flex-row items-center mb-2 justify-center">
      <Text className="text-xs text-gray-500 mx-0.5">{item.time}</Text>
      <Text className="text-xs text-gray-500 mx-0.5">•</Text>
      <Star size={12} color="#FFD700" weight="fill" />
      <Text className="text-xs text-gray-500 mx-0.5">{item.rating}</Text>
    </View>
    <View className="flex-row justify-between items-center w-full px-1">
      <Text className="text-lg font-bold text-gray-800">${item.price?.toFixed(2)}</Text>
      <TouchableOpacity className="bg-gray-800 p-2 rounded-lg">
        <Plus size={16} color="#FFF" weight="bold" />
      </TouchableOpacity>
    </View>
  </View>
);


const FavoritesScreen = () => {
  const categories = [
    { name: 'Pizza', icon: '🍕', color: 'bg-orange-100' }, 
    { name: 'Asian', icon: '🍣', color: 'bg-red-100' },    
    { name: 'Donut', icon: '🍩', color: 'bg-yellow-100' }, 
    { name: 'Blue', icon: '🔵', color: 'bg-blue-100' },  
  ];

  const favoriteItems: FavoriteItem[] = [
    {
      id: '1',
      name: 'Chicken Hell',
      image: 'https://picsum.photos/150/150?random=1',
      tag: 'Healthy',
      tagColor: '#E0FFE0',
      time: '24min',
      rating: 4.8,
      price: 12.99,
      category: 'Pizza',
    },
    {
      id: '2',
      name: 'Swe Dish',
      image: 'https://picsum.photos/150/150?random=2',
      tag: 'Trending',
      tagColor: '#FFE0E0',
      time: '34min',
      rating: 4.9,
      price: 19.99,
      category: 'Pizza',
    },
     {
      id: '3',
      name: 'Another Dish',
      image: 'https://picsum.photos/150/150?random=3',
      time: '15min',
      rating: 4.5,
      price: 9.50,
      category: 'Asian',
    },
    {
      id: '4',
      name: 'Special Meal',
      image: 'https://picsum.photos/150/150?random=4',
      tag: 'New',
      tagColor: '#E6E6FA', 
      time: '40min',
      rating: 4.7,
      price: 22.00,
      category: 'Asian',
    },
  ];


  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <Header />

        {/* Search Section */}
        <View className="flex-row px-5 py-4 items-stretch bg-gray-100">
          <View className="flex-1 flex-row bg-white rounded-xl px-4 py-2 items-center mr-2.5 shadow-sm">
            <MagnifyingGlass size={22} color="#AAA" />
            <TextInput placeholder="Search" className="ml-2.5 text-base flex-1 text-gray-800" />
          </View>
          <TouchableOpacity className="bg-[#8A2BE2] p-3 rounded-xl shadow-md flex-row items-center justify-center">
            <SlidersHorizontal size={24} color="#FFF" weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Categories Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pt-1 pb-5 bg-gray-100">
          {categories.map((category, index) => (
            <TouchableOpacity key={index} className={`flex-row items-center px-4 py-2.5 rounded-2xl mr-2.5 shadow-sm ${category.color}`}>
              <Text className="text-sm font-medium text-gray-700">{category.name}</Text>
              <Text className="text-base ml-1.5">{category.icon}</Text> 
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Content Area */}
        <View className=" z-10 pt-2.5">
          <Text className="text-2xl font-bold text-gray-800 px-5 pt-2.5 pb-4">Most Favourite</Text>
          <View className="flex-row flex-wrap justify-between px-5 pt-1">
            {favoriteItems.map(item => (
              <FavoriteItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
