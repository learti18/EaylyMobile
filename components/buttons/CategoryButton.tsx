import Hotdog from "@/assets/icons/Hotdog.svg";
import Icecream from "@/assets/icons/Icecream.svg";
import Pizza from "@/assets/icons/Pizza.svg";
import Zongzi from "@/assets/icons/Zongzi.svg";

import React, { JSX } from "react";
import { Dimensions, Text, TouchableHighlight, View } from "react-native";

const CategoryButton = ({
  category,
  isActive = false,
  onPress,
}: CategoryButtonProps) => {
  const categoryStyle = CATEGORY_STYLES[category.name] || DEFAULT_CATEGORY;

  const buttonWidth = Dimensions.get("window").width * 0.2;

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={categoryStyle.bg}
      style={{
        backgroundColor: categoryStyle.bg,
        borderWidth: isActive ? 4 : 0,
        borderColor: isActive ? categoryStyle.text : "transparent",
        width: buttonWidth,
        height: 110,
      }}
      className="rounded-3xl py-1 mr-3"
    >
      {/* Wrap all content in a single View for TouchableHighlight */}
      <View className="flex-1 justify-center items-center">
        <View className="mb-2">{categoryStyle.icon}</View>
        <Text
          style={{ color: categoryStyle.text }}
          className="font-medium text-sm text-center mt-1"
          numberOfLines={2}
        >
          {category.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; icon: JSX.Element }
> = {
  FastFood: {
    bg: "#FFF3D6",
    text: "#D69900",
    icon: <Pizza width={36} height={36} />,
  },
  Asian: {
    bg: "#B9E2CA",
    text: "#00732F",
    icon: <Zongzi width={36} height={36} />,
  },
  Dessert: {
    bg: "#C5D4FF",
    text: "#022274",
    icon: <Icecream width={36} height={36} />,
  },
  Vegan: {
    bg: "#B9E2CA",
    text: "#00732F",
    icon: <Hotdog width={40} height={40} />,
  },
  All: {
    bg: "#E5E7EB",
    text: "#4B5563",
    icon: <View className="w-4 h-4 rounded-full bg-gray-300" />,
  },
};

const DEFAULT_CATEGORY = {
  bg: "#E5E7EB",
  text: "#4B5563",
  icon: <Pizza />, // Default icon
};

export default CategoryButton;
