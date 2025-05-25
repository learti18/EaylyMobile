import { useUpdateCartItem } from "@/queries/useCart";
import { Trash } from "phosphor-react-native";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SharedValue } from "react-native-reanimated";

const DELETE_BUTTON_WIDTH = 65;

interface CartCardProps extends CartItem {
  onDelete?: () => void;
}

const CartCard = ({
  id,
  foodId,
  foodImageUrl,
  foodName,
  price,
  quantity,
  onDelete,
}: CartCardProps) => {
  const swipeableRef = useRef(null);
  const { mutate: updateCartItem } = useUpdateCartItem();

  const handleIncrement = () => {
    updateCartItem({ foodId, quantity: quantity + 1 });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateCartItem({ foodId, quantity: quantity - 1 });
    } else {
      // If quantity would become 0, delete the item instead
      onDelete && onDelete();
    }
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>
  ) => {
    return (
      <View
        style={{
          width: DELETE_BUTTON_WIDTH,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          overflow: "hidden",
        }}
        className="flex justify-center bg-primary-500"
      >
        <TouchableOpacity
          onPress={() => {
            swipeableRef.current?.close();
            onDelete && onDelete();
          }}
          activeOpacity={0.7}
          className="h-full flex justify-center items-center px-5"
          style={{
            width: DELETE_BUTTON_WIDTH,
          }}
        >
          <Trash size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  // Calculate item unit price
  const unitPrice = quantity > 0 ? price / quantity : 0;

  return (
    <GestureHandlerRootView className="mb-4">
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <ReanimatedSwipeable
          ref={swipeableRef}
          friction={2}
          rightThreshold={DELETE_BUTTON_WIDTH / 2}
          overshootRight={false}
          overshootFriction={10}
          renderRightActions={renderRightActions}
          dragOffsetFromRightEdge={10}
        >
          <View className="bg-white flex-row justify-between items-center px-2 py-3">
            <View className="flex-row gap-4 items-center">
              <Image
                source={{ uri: foodImageUrl }}
                className="w-20 h-20 rounded-full"
                resizeMode="cover"
              />
              <View>
                <Text className="text-lg font-semibold">{foodName}</Text>
                <Text className="text-base font-semibold text-gray-700">
                  ${unitPrice.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex-col items-center gap-2">
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleDecrement}
                  className="w-9 h-9 border border-[#323142] rounded-xl flex items-center justify-center bg-white"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    className="text-[#323142] text-xl"
                    style={{ textAlign: "center", lineHeight: 24 }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <Text className="text-lg font-medium min-w-[30px] text-center">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  className="w-9 h-9 rounded-xl bg-[#323142] flex items-center justify-center"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    className="text-white text-xl"
                    style={{ textAlign: "center", lineHeight: 24 }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-base font-semibold text-[#323142]">
                ${price.toFixed(2)}
              </Text>
            </View>
          </View>
        </ReanimatedSwipeable>
      </View>
    </GestureHandlerRootView>
  );
};

export default CartCard;
