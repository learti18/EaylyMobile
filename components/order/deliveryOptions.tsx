import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

interface Address {
  id: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

type DeliveryType = "delivery" | "pickup";

interface DeliveryOptionsProps {
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  addresses: Address[];
  selectedAddressId: number | null;
  handleAddressSelect: (id: number) => void;
  isAddingNewAddress: boolean;
  setIsAddingNewAddress: (isAdding: boolean) => void;
  isLoadingAddresses: boolean;
  onDeleteAddress?: (id: number) => void;
}

export default function DeliveryOptions({
  deliveryType,
  setDeliveryType,
  addresses,
  selectedAddressId,
  handleAddressSelect,
  isAddingNewAddress,
  setIsAddingNewAddress,
  isLoadingAddresses,
  onDeleteAddress, // Add this prop
}: DeliveryOptionsProps) {
  const [showDeleteFor, setShowDeleteFor] = useState<number | null>(null);

  const handleLongPress = (addressId: number) => {
    if (onDeleteAddress) {
      setShowDeleteFor(addressId);
    }
  };

  const handleDeletePress = (addressId: number, streetAddress: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${streetAddress}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowDeleteFor(null),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAddress?.(addressId);
            setShowDeleteFor(null);
          },
        },
      ]
    );
  };

  const handleAddressPress = (addressId: number) => {
    if (showDeleteFor === addressId) {
      setShowDeleteFor(null);
    } else {
      handleAddressSelect(addressId);
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-6">
      <Text className="text-lg font-semibold mb-4">Delivery Options</Text>

      <View className="flex-row gap-4 mb-4">
        <Pressable
          className={`flex-1 p-3 rounded-lg border ${
            deliveryType === "delivery"
              ? "border-primary-500 bg-primary-100"
              : "border-gray-200"
          }`}
          onPress={() => setDeliveryType("delivery")}
        >
          <Text className="font-medium">Home Delivery</Text>
          <Text className="text-sm text-gray-500">
            Delivery to your address
          </Text>
        </Pressable>

        <Pressable
          className={`flex-1 p-3 rounded-lg border ${
            deliveryType === "pickup"
              ? "border-primary-500 bg-primary-100"
              : "border-gray-200"
          }`}
          onPress={() => setDeliveryType("pickup")}
        >
          <Text className="font-medium">Restaurant Pickup</Text>
          <Text className="text-sm text-gray-500">Pickup from restaurant</Text>
        </Pressable>
      </View>

      {deliveryType === "delivery" && (
        <View>
          <Text className="font-medium text-gray-700 mb-3">
            Select Delivery Address
          </Text>

          {!isLoadingAddresses && addresses.length === 0 ? (
            <View className="bg-gray-50 p-4 rounded-lg mb-3">
              <Text className="text-gray-600 mb-2">
                No saved addresses found.
              </Text>
              <Pressable onPress={() => setIsAddingNewAddress(true)}>
                <Text className="text-purple font-medium">
                  + Add a new address
                </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {addresses.map((item) => (
                <View key={item.id.toString()} className="relative">
                  <Pressable
                    onPress={() => handleAddressPress(item.id)}
                    onLongPress={() => handleLongPress(item.id)}
                    className={`p-4 rounded-lg mb-2 ${
                      selectedAddressId === item.id
                        ? "border border-primary-500 bg-primary-100"
                        : "border border-gray-200"
                    }`}
                  >
                    <Text className="font-medium">{item.streetAddress}</Text>
                    <Text className="text-sm text-gray-500">
                      {item.city}, {item.state} {item.zipCode}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.phoneNumber}
                    </Text>
                    {item.isDefault && (
                      <Text className="text-xs text-purple mt-1 font-medium">
                        Default
                      </Text>
                    )}
                  </Pressable>

                  {showDeleteFor === item.id && (
                    <Pressable
                      onPress={() =>
                        handleDeletePress(item.id, item.streetAddress)
                      }
                      className="absolute right-2 top-2 bg-red-500 rounded-full px-3 py-1"
                    >
                      <Text className="text-white text-xs font-medium">
                        Delete
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={() => setIsAddingNewAddress(true)}
            className="my-2 p-2 rounded-lg flex-row items-center justify-center"
          >
            <Text className="text-primary-500 font-medium">
              + Add a new address
            </Text>
          </Pressable>
        </View>
      )}

      {deliveryType === "pickup" && (
        <View className="bg-gray-50 p-4 rounded-lg mt-4">
          <Text className="text-gray-700">
            Please pick up your order from the restaurant. Youll receive a
            notification when its ready.
          </Text>
        </View>
      )}
    </View>
  );
}
