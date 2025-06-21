import React from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface FormInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  className?: string;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  className = "",
}: FormInputProps) {
  return (
    <View className={className}>
      <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        className={`border rounded-xl px-4 py-3.5 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
        }`}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1.5 pl-1">{error}</Text>
      )}
    </View>
  );
}
