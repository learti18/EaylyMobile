import OrderItem from "@/components/order/orderItem";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/constants/constantStyles";
import { useFetchOrderById } from "@/queries/useOrder";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CalendarBlank,
  CreditCard,
  Receipt,
} from "phosphor-react-native";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: order, isLoading, isError } = useFetchOrderById(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-red-500 text-center text-lg mb-4">
            Error loading order details
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 -ml-2"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Order Details</Text>
          <Text className="text-sm text-gray-500">Order #{order.id}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View className="bg-white mx-5 mt-5 p-4 rounded-xl border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary-100 p-2 rounded-full">
                <Receipt size={20} color="#6C5FBC" />
              </View>
              <View>
                <Text className="font-semibold text-gray-900">
                  Order Status
                </Text>
                <Text className="text-sm text-gray-500">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : ""}
                </Text>
              </View>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={getOrderStatusColor(order.status || order.orderStatus)}
            >
              <Text className="text-sm font-medium capitalize">
                {order.status || order.orderStatus}
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-primary-500">
                $
                {order.total?.toFixed(2) ||
                  order.totalPrice?.toFixed(2) ||
                  "0.00"}
              </Text>
              {order.paymentStatus && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={getPaymentStatusColor(order.paymentStatus)}
                >
                  <Text className="text-sm font-medium capitalize">
                    {order.paymentStatus}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Order Info */}
        <View className="bg-white mx-5 mt-4 p-4 rounded-xl border border-gray-100">
          <Text className="font-semibold text-gray-900 mb-3">
            Order Information
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center gap-3">
              <CalendarBlank size={16} color="#6B7280" />
              <View>
                <Text className="text-sm text-gray-500">Order Date</Text>
                <Text className="font-medium text-gray-900">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </Text>
              </View>
            </View>

            {order.paymentMethod && (
              <View className="flex-row items-center gap-3">
                <CreditCard size={16} color="#6B7280" />
                <View>
                  <Text className="text-sm text-gray-500">Payment Method</Text>
                  <Text className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center gap-3">
              <Ionicons name="restaurant" size={16} color="#6B7280" />
              <View>
                <Text className="text-sm text-gray-500">Items</Text>
                <Text className="font-medium text-gray-900">
                  {order.items?.length || 0} items
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View className="bg-white mx-5 mt-4 mb-5 rounded-xl border border-gray-100 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="font-semibold text-gray-900">Order Items</Text>
          </View>

          {order.items && order.items.length > 0 ? (
            <FlatList
              data={order.items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="px-4 py-3 border-b border-gray-50 last:border-b-0">
                  <OrderItem {...item} />
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <View className="p-4 items-center">
              <Text className="text-gray-500">No items found</Text>
            </View>
          )}

          {/* Order Summary */}
          <View className="p-4 bg-gray-50 border-t border-gray-100">
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-medium">
                  $
                  {(
                    order.totalPrice -
                    (order.deliveryFee || 0) -
                    (order.tax || 0)
                  )?.toFixed(2) ||
                    order.totalPrice?.toFixed(2) ||
                    "0.00"}
                </Text>
              </View>

              {order.deliveryFee && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Delivery Fee</Text>
                  <Text className="font-medium">
                    ${order.deliveryFee.toFixed(2)}
                  </Text>
                </View>
              )}

              {order.tax && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tax</Text>
                  <Text className="font-medium">${order.tax.toFixed(2)}</Text>
                </View>
              )}

              <View className="border-t border-gray-200 pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-lg text-gray-900">
                    Total
                  </Text>
                  <Text className="font-bold text-xl text-primary-500">
                    $
                    {order.totalPrice?.toFixed(2) ||
                      order.totalPrice?.toFixed(2) ||
                      "0.00"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
