import React from "react";
import { Text, View } from "react-native";

export type BadgeType = "Healthy" | "Trending" | "Special";

interface BadgeProps {
  type: BadgeType;
}

export default function Badge({ type }: BadgeProps) {
  const style = {
    Healthy: {
      backgroundColor: "#F7EDD0",
      color: "#DAA31A",
    },
    Trending: {
      backgroundColor: "#F7C5BA",
      color: "#FB471D",
    },
    Special: {
      backgroundColor: "#D6EEE0",
      color: "#309D5B",
    },
  };
  const currentStyle = style[type] || {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  };
  return (
    <View
      style={{
        backgroundColor: currentStyle.backgroundColor,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
        alignItems: "center",
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: currentStyle.color,
          fontSize: 11,
          fontWeight: "400",
        }}
      >
        {type || "Unknown"}
      </Text>
    </View>
  );
}
