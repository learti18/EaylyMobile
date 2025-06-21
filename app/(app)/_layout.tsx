import TabBarButton from "@/components/buttons/TabBarButton";
import { useFetchCart } from "@/queries/useCart";
import { Tabs } from "expo-router";
import { Basket, Bell, Heart, House, User } from "phosphor-react-native";
import React from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const hiddenRoutes = ["restaurants", "/home/restaurants", "basket/orders"];

const AppTabLayout = () => {
  const { data: cartData } = useFetchCart();
  const cartItemCount = cartData?.cartItems?.length || 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              <View
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TabBarButton Icon={Basket} size={32} isFocused={focused} />
                {cartItemCount > 0 && (
                  <View
                    className="absolute bg-primary-500 rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                    style={{
                      top: 4,
                      right: 4,
                      zIndex: 10,
                    }}
                  >
                    <Text className="text-white text-xs font-bold">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Text>
                  </View>
                )}
              </View>
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
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
          redirect={true}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default AppTabLayout;
