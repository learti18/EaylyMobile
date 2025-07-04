import OrderCard from "@/components/cards/orderCard";
import Header from "@/components/generic/header";
import { useInfiniteOrders } from "@/queries/useOrder";
import { useRouter } from "expo-router";
import { Bell, Package } from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Notifications = () => {
  const router = useRouter();

  const { data, isLoading, error, refetch, isRefetching } = useInfiniteOrders({
    pageSize: 4,
  });

  const orders = data?.pages.flatMap((page) => page.items) ?? [];
  const recentOrders = orders.slice(0, 4);

  const handleRefresh = () => {
    refetch();
  };

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/(app)/basket/orders/${orderId}`);
  };

  const navigateToAllOrders = () => {
    router.push("/(app)/basket/orders");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C5FBC" />
          <Text className="mt-4 text-gray-500 text-lg">
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Header />
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-red-500 text-center text-lg mb-4">
            Error loading notifications
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className="bg-primary-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header />

      {/* Header Section */}
      <View className="px-5 py-4">
        <View className="flex-row items-center mb-2">
          <Bell size={24} color="#6C5FBC" weight="fill" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">
            Notifications
          </Text>
        </View>
        <Text className="text-gray-500">
          Your recent order updates and activities
        </Text>
      </View>

      {/* Recent Orders Section */}
      <View className="px-5 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-800">
            Recent Orders
          </Text>
          {recentOrders.length > 0 && (
            <TouchableOpacity onPress={navigateToAllOrders}>
              <Text className="text-primary-500 font-medium">View All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Orders List */}
      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: order }) => (
          <TouchableOpacity
            onPress={() => navigateToOrderDetails(order.id.toString())}
            activeOpacity={0.7}
          >
            <OrderCard {...order} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={["#6C5FBC"]}
            tintColor="#6C5FBC"
          />
        }
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Package size={48} color="#6C5FBC" />
            <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
              No Recent Orders
            </Text>
            <Text className="text-gray-500 text-center mb-6 px-8">
              You haven&apos;t placed any orders yet. Start browsing our menu!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="bg-primary-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Browse Menu</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;
