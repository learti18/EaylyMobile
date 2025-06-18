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
  return (
    <View
      style={{
        backgroundColor: style[type].backgroundColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: style[type].color,
          fontSize: 12,
          fontWeight: "500",
        }}
      >
        {type}
      </Text>
    </View>
  );
}
