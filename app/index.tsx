import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Redirect } from "expo-router";
import React from "react";

const isAuthenticated = true;

const index = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
};

export default index;
