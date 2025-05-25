import * as Location from "expo-location";
import { CaretDown, MapPin } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

function Header() {
  const [location, setLocation] = useState<{
    street?: string;
    city?: string;
    errorMsg?: string;
  }>({
    street: "Getting location...",
    city: "",
  });

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation({ errorMsg: "Permission to access location was denied" });
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const address = geocode[0];
          setLocation({
            street: address.street || address.name || "Current Location",
            city: address.city || address.region || "",
          });
        }
      } catch (error) {
        setLocation({ errorMsg: "Error getting location" });
      }
    };

    getLocation();
  }, []);

  const locationDisplay = location.errorMsg ? location.errorMsg : location.city;

  return (
    <View className="flex-row justify-between items-center px-5 mt-8 pb-2.5">
      <View>
        <View className="flex-row items-center">
          <MapPin size={16} color="#6C5FBC" weight="fill" />
          <Text className="text-xs text-gray-500 ml-1">Location</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-base font-bold text-gray-800">
            {locationDisplay}
          </Text>
          <CaretDown size={16} color="#333" weight="bold" />
        </View>
      </View>
      <Image
        source={{ uri: "https://picsum.photos/40/40?random=0" }}
        className="w-14 h-14 rounded-2xl"
      />
    </View>
  );
}

export default Header;
