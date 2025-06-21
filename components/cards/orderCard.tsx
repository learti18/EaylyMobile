import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/constants/constantStyles";
import { useRouter } from "expo-router";
import { ShoppingBagOpen } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type OrderCardProps = {
  id: string | number;
  orderDate?: string | Date;
  items?: any[];
  totalPrice?: number;
  orderStatus: string;
  paymentStatus?: string;
};

const OrderCard = ({
  id,
  orderDate,
  items,
  totalPrice,
  orderStatus,
  paymentStatus,
}: OrderCardProps) => {
  const router = useRouter();
  const orderStatusColors = getOrderStatusColor(orderStatus);
  const paymentStatusColors = paymentStatus
    ? getPaymentStatusColor(paymentStatus)
    : null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/basket/orders/${id}`)}
      className="mb-4 mx-5 bg-white rounded-xl border border-gray-100"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary-100 p-2 rounded-full items-center justify-center">
              <ShoppingBagOpen size={20} weight="fill" color="#6C5FBC" />
            </View>
            <View>
              <Text className="font-semibold text-gray-900">Order #{id}</Text>
              <Text className="text-sm text-gray-500">
                {orderDate ? new Date(orderDate).toLocaleDateString() : ""}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-sm text-gray-600 mb-1">
              {items?.length || 0} items
            </Text>
            <Text className="text-xl font-bold text-primary-500">
              ${totalPrice?.toFixed(2) || "0.00"}
            </Text>
          </View>
          <View className="items-end gap-1">
            <View className="px-2 py-1 rounded-full" style={orderStatusColors}>
              <Text className="text-xs font-medium capitalize">
                {orderStatus}
              </Text>
            </View>
            {paymentStatus && paymentStatusColors && (
              <View
                className="px-2 py-1 rounded-full"
                style={paymentStatusColors}
              >
                <Text className="text-xs font-medium capitalize">
                  {paymentStatus}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
