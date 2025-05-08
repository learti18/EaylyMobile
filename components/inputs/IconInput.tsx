import { IconProps } from "phosphor-react-native";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface IconInputProps extends TextInputProps {
  icon: React.ElementType<IconProps>;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const IconInput = ({
  icon: Icon,
  rightIcon,
  onRightIconPress,
  ...props
}: IconInputProps) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleChangeText = (text: string) => {
    setIsFilled(text.length > 0);
    props.onChangeText?.(text);
  };

  return (
    <View
      className={`bg-white rounded-2xl flex-row items-center px-5 py-2 w-[320px] ${
        isFilled ? "border-[1.5px] border-primary-500" : ""
      }`}
    >
      <Icon size={24} color={isFilled ? "#6C5FBC" : "#9CA3AF"} weight="bold" />
      <TextInput
        style={{ height: 48, paddingHorizontal: 10, paddingVertical: 4 }}
        className="flex-1 px-4 text-primary-500"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="none"
        onChangeText={handleChangeText}
        {...props}
      />
      {rightIcon && (
        <Pressable onPress={onRightIconPress}>{rightIcon}</Pressable>
      )}
    </View>
  );
};

export default IconInput;
