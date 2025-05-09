import { IconProps } from "phosphor-react-native";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface IconInputProps extends TextInputProps {
  icon: React.ElementType<IconProps>;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  control: Control<any>;
  name: string;
  error?: string;
}

const IconInput = ({
  icon: Icon,
  rightIcon,
  onRightIconPress,
  onChangeText,
  control,
  name,
  error,
  ...props
}: IconInputProps) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleChangeText = (text: string) => {
    setIsFilled(text.length > 0);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="w-full">
          <View
            className={`bg-white rounded-2xl flex-row items-center px-5 py-2 w-full ${
              isFilled ? "border-[1.5px] border-primary-500" : ""
            }`}
          >
            <Icon
              size={24}
              color={isFilled ? "#6C5FBC" : error ? "#EF4444" : "#9CA3AF"}
              weight="bold"
            />
            <TextInput
              style={{ height: 48, paddingHorizontal: 10, paddingVertical: 4 }}
              className="flex-1 px-4 text-primary-500 font-medium"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="none"
              onChangeText={(text) => {
                setIsFilled(text.length > 0);
                onChange(text);
              }}
              onBlur={onBlur}
              value={value}
              {...props}
            />
            {rightIcon && (
              <Pressable onPress={onRightIconPress}>{rightIcon}</Pressable>
            )}
          </View>
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-2">{error}</Text>
          )}
        </View>
      )}
    />
  );
};

export default IconInput;
