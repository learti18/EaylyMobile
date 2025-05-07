import TabBarButton from "@/components/buttons/TabBarButton";
import { Tabs } from "expo-router";
import { Basket, Bell, Heart, House, User } from "phosphor-react-native";
import React from "react";

const hiddenRoutes = ["restaurants", "/home/restaurants"];

const AppTabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#6C5FBC",
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          height: 74,
          justifyContent: "center",
          borderTopWidth: 0,
        },
        tabBarButton: hiddenRoutes.some((path) => route.name.startsWith(path))
          ? () => null
          : undefined,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarButton Icon={House} size={32} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favorites",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarButton Icon={Heart} size={32} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Basket",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarButton Icon={Basket} size={32} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarButton Icon={Bell} size={32} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarButton Icon={User} size={32} isFocused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default AppTabLayout;
