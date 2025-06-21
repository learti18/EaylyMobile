import React from "react";
import { Pressable, Text, View } from "react-native";

interface Position {
  latitude: number;
  longitude: number;
}

interface FormActionsProps {
  position: Position | null;
  setIsAddingNewAddress: (isAdding: boolean) => void;
  onSubmit?: () => void;
}

export default function FormActions({
  position,
  setIsAddingNewAddress,
  onSubmit,
}: FormActionsProps) {
  return (
    <View className="flex-row gap-4 mt-2">
      <Pressable
        onPress={() => setIsAddingNewAddress(false)}
        className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl bg-white"
      >
        <Text className="text-gray-700 text-center font-medium">Cancel</Text>
      </Pressable>
      <Pressable
        disabled={!position}
        onPress={position && onSubmit ? onSubmit : undefined}
        className={`flex-1 px-4 py-3.5 rounded-xl items-center ${
          !position ? "bg-primary-500" : "bg-purple"
        }`}
      >
        <Text
          className={`text-center font-medium ${
            !position ? "text-white" : "text-white"
          }`}
        >
          Save Address
        </Text>
      </Pressable>
    </View>
  );
}
