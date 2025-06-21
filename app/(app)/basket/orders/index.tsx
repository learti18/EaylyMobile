import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/constants/constantStyles";
import { useFetchOrders } from "@/queries/useOrder";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Package, ShoppingBagOpen } from "phosphor-react-native";
import React, { useState } from "react";
import {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: orderData,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch,
  } = useFetchOrders({
    pageNumber: currentPage,
    pageSize,
    orderStatus: orderStatusFilter !== "All" ? orderStatusFilter : undefined,
    paymentStatus:
      paymentStatusFilter !== "All" ? paymentStatusFilter : undefined,
  });

  const orders = orderData?.items || orderData || [];
  const totalOrders = orderData?.totalCount || orders.length;
  const totalPages = orderData?.totalPages || Math.ceil(totalOrders / pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch(); // Trigger refetch when page changes
    }
  };

  const resetFilters = () => {
    setOrderStatusFilter("All");
    setPaymentStatusFilter("All");
  };

  const hasActiveFilters =
    orderStatusFilter !== "All" || paymentStatusFilter !== "All";

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <View className="px-5 pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {orderStatusFilter !== "All" && (
                <View className="bg-primary-50 px-3 py-1 rounded-full flex-row items-center">
                  <Text className="text-primary-700 text-sm">
                    Status: {orderStatusFilter}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setOrderStatusFilter("All")}
                    className="ml-2"
                  >
                    <Ionicons name="close" size={14} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              )}
              {paymentStatusFilter !== "All" && (
                <View className="bg-primary-50 px-3 py-1 rounded-full flex-row items-center">
                  <Text className="text-primary-700 text-sm">
                    Payment: {paymentStatusFilter}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPaymentStatusFilter("All")}
                    className="ml-2"
                  >
                    <Ionicons name="close" size={14} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Orders List */}
      <View className="flex-1 px-5">
        {ordersLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">
              Loading your orders...
            </Text>
          </View>
        ) : ordersError ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-center text-lg mb-4">
              Error loading orders. Please try again later.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-primary-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: order }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(app)/basket/orders/${order.id}`)}
                className="mb-4 bg-white rounded-xl border border-gray-100"
              >
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-primary-100 p-2 rounded-full items-center justify-center">
                        <ShoppingBagOpen
                          size={20}
                          weight="fill"
                          color="#6C5FBC"
                        />
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900">
                          Order #{order.id}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-end">
                    <View>
                      <Text className="text-sm text-gray-600 mb-1">
                        {order.items?.length || 0} items
                      </Text>
                      <Text className="text-xl font-bold text-primary-500">
                        $
                        {order.total?.toFixed(2) ||
                          order.totalPrice?.toFixed(2) ||
                          "0.00"}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <View
                        className={`px-2 py-1 rounded-full ${getOrderStatusColor(
                          order.status || order.orderStatus
                        )}`}
                      >
                        <Text className="text-xs font-medium capitalize">
                          {order.status || order.orderStatus}
                        </Text>
                      </View>
                      {order.paymentStatus && (
                        <View
                          className={`px-2 py-1 rounded-full ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          <Text className="text-xs font-medium capitalize">
                            {order.paymentStatus}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center py-20">
                <View className="items-center">
                  <View className="items-center justify-center mb-4">
                    <Package size={48} color="#6C5FBC" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 mb-2">
                    No Orders Found
                  </Text>
                  <Text className="text-gray-500 text-center mb-6 px-8">
                    {hasActiveFilters
                      ? "No orders match your current filters. Try changing your filters."
                      : "You haven't placed any orders yet. Start shopping to see your orders here."}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/home")}
                    className="bg-primary-500 px-6 py-3 rounded-xl"
                  >
                    <Text className="text-white font-semibold">
                      Browse Menu
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Pagination */}
      {orders.length > 0 && totalPages > 1 && (
        <View className="px-5 py-4 bg-white border-t border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-700">
              {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalOrders)} of {totalOrders}
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1 ? "opacity-30" : ""
                }`}
              >
                <Ionicons name="chevron-back" size={18} color="#374151" />
              </TouchableOpacity>

              <Text className="px-3 py-1 bg-primary-500 text-white rounded-md">
                {currentPage}
              </Text>

              <TouchableOpacity
                onPress={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages ? "opacity-30" : ""
                }`}
              >
                <Ionicons name="chevron-forward" size={18} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
                  onPress={() => {
                    setCurrentPage(1);
                    setShowFilters(false);
                    refetch(); // Trigger refetch when filters are applied
                  }}
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
