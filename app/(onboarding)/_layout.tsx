import { Stack } from "expo-router";
import React from "react";

const OnBoardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default OnBoardingLayout;
