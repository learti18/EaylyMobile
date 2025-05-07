import { StyleSheet, View } from "react-native";

const TabBarButton = ({
  Icon,
  size = 33,
  color = "#6C5FBC",
  shadowColor = "#6C5FBC",
  interiorColor = "#DBD9EE",
  isFocused = false,
}: any) => {
  if (!isFocused) {
    return (
      <Icon
        weight="regular"
        size={size}
        color="#9CA3AF"
        style={{ opacity: 0.5 }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Shadow layer */}
      <Icon
        weight="fill"
        size={size}
        color={shadowColor}
        style={[
          StyleSheet.absoluteFillObject,
          { top: 3, left: 1.5, zIndex: 0 },
        ]}
      />
      {/* Main border layer */}
      <Icon
        weight="fill"
        size={size}
        color={color}
        style={[
          StyleSheet.absoluteFillObject,
          { top: 0, left: -0.5, zIndex: 1 },
        ]}
      />
      {/* Light interior layer */}
      <Icon
        weight="fill"
        size={size - 5}
        color={interiorColor}
        style={[StyleSheet.absoluteFillObject, { top: 3, left: 2, zIndex: 2 }]}
      />
    </View>
  );
};

export default TabBarButton;
