import OrderCard from "@/components/cards/orderCard";
import { useInfiniteOrders } from "@/queries/useOrder";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Package } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const orderStatusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "All", label: "All Payments" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const Orders = () => {
  const router = useRouter();
  const pageSize = 5;

  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteOrders({
    pageSize,
    orderStatus: orderStatusFilter !== "All" ? orderStatusFilter : undefined,
    paymentStatus:
      paymentStatusFilter !== "All" ? paymentStatusFilter : undefined,
  });

  const orders = data?.pages.flatMap((page) => page.items) ?? [];

  const resetFilters = () => {
    setOrderStatusFilter("All");
    setPaymentStatusFilter("All");
  };

  const hasActiveFilters =
    orderStatusFilter !== "All" || paymentStatusFilter !== "All";

  useEffect(() => {
    refetch();
  }, [orderStatusFilter, paymentStatusFilter]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mt-10">
      {/* Header */}
      <View className="px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Your Orders</Text>
          <Text className="text-gray-500 mt-1">Track your order history</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          className={`px-4 py-2 rounded-lg flex-row items-center gap-2 ${
            hasActiveFilters
              ? "bg-primary-500"
              : "bg-white border border-gray-200"
          }`}
        >
          <Ionicons
            name="filter"
            size={16}
            color={hasActiveFilters ? "white" : "#6B7280"}
          />
          <Text
            className={
              hasActiveFilters ? "text-white font-medium" : "text-gray-700"
            }
          >
            {hasActiveFilters ? "Filters Active" : "Filter"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item: order }) => <OrderCard {...order} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 justify-center items-center mt-20">
              <ActivityIndicator size="large" color="#6C5FBC" />
              <Text className="mt-4 text-gray-500 text-lg">
                Loading orders...
              </Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Package size={48} color="#6C5FBC" />
              <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                No Orders Found
              </Text>
              <Text className="text-gray-500 text-center mb-6 px-8">
                {hasActiveFilters
                  ? "No orders match your current filters."
                  : "You haven't placed any orders yet."}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="bg-primary-500 px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-semibold">Browse Menu</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#6C5FBC" />
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Filter Orders
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-6">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-3">
                    Order Status
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {orderStatusOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => setOrderStatusFilter(option.value)}
                          className={`px-4 py-2 rounded-full border ${
                            orderStatusFilter === option.value
                              ? "bg-primary-500 border-primary-500"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <Text
                            className={
                              orderStatusFilter === option.value
                                ? "text-white"
                                : "text-gray-700"
                            }
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-3">
                    Payment Status
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {paymentStatusOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => setPaymentStatusFilter(option.value)}
                          className={`px-4 py-2 rounded-full border ${
                            paymentStatusFilter === option.value
                              ? "bg-primary-500 border-primary-500"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <Text
                            className={
                              paymentStatusFilter === option.value
                                ? "text-white"
                                : "text-gray-700"
                            }
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <View className="flex-row gap-3 mt-8">
                <TouchableOpacity
                  onPress={resetFilters}
                  className={`flex-1 py-3 rounded-xl border border-gray-200 ${
                    hasActiveFilters ? "bg-gray-50" : "bg-gray-100"
                  }`}
                  disabled={!hasActiveFilters}
                >
                  <Text
                    className={`text-center font-medium ${
                      hasActiveFilters ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    Clear Filters
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-primary-500 rounded-xl"
                >
                  <Text className="text-white text-center font-medium">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Orders;
