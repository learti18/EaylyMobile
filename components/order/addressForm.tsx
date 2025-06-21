import { AddressFormData } from "@/types/address/address";
import * as Location from "expo-location";
import { MapPin } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import FormInput from "../ui/FormInput";
import FormActions from "./formActions";

interface Position {
  latitude: number;
  longitude: number;
}

interface AddressFormProps {
  control: Control<AddressFormData>;
  handleSubmit: UseFormHandleSubmit<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  setValue: UseFormSetValue<AddressFormData>;
  getValues: UseFormGetValues<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
  setIsAddingNewAddress: (isAdding: boolean) => void;
}

export default function AddressForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  getValues,
  errors,
  setIsAddingNewAddress,
}: AddressFormProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const isDefault = useWatch({ control, name: "isDefault" });

  const [formValues, setFormValues] = useState({
    streetAddress: getValues("streetAddress") || "",
    city: getValues("city") || "",
    state: getValues("state") || "",
    zipCode: getValues("zipCode") || "",
    phoneNumber: getValues("phoneNumber") || "",
  });

  useEffect(() => {
    if (position) {
      setValue("latitude", position.latitude);
      setValue("longitude", position.longitude);
    }
  }, [position, setValue]);

  useEffect(() => {
    setMapReady(false);

    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFormValues({
      streetAddress: getValues("streetAddress") || "",
      city: getValues("city") || "",
      state: getValues("state") || "",
      zipCode: getValues("zipCode") || "",
      phoneNumber: getValues("phoneNumber") || "",
    });
  }, [getValues]);

  const updateAddressFromCoords = async (coords: Position) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];

        const streetAddress = [
          address.name,
          address.street,
          address.district,
          address.streetNumber,
        ]
          .filter(Boolean)
          .join(", ");

        setFormValues((prev) => ({
          ...prev,
          streetAddress: streetAddress,
          city: address.city || prev.city,
          state: address.region || prev.state,
          zipCode: address.postalCode || prev.zipCode,
        }));

        setValue("streetAddress", streetAddress);
        if (address.city) setValue("city", address.city);
        if (address.region) setValue("state", address.region);
        if (address.postalCode) setValue("zipCode", address.postalCode);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setPosition(coords);
      await updateAddressFromCoords(coords);
    } catch (err) {
      if (err instanceof Error) {
        alert(`Failed to get location: ${err.message}`);
      } else {
        alert("Failed to get location: An unknown error occurred.");
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  // Handler for when user taps on map
  const handleMapPress = async (e: any) => {
    const newCoords = e.nativeEvent.coordinate;
    setPosition(newCoords);
    await updateAddressFromCoords(newCoords);
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setValue(field, value);
  };

  return (
    <View className="bg-white rounded-xl p-5 mb-6">
      <Text className="text-xl font-bold mb-5 text-gray-800">
        Add New Address
      </Text>

      <View className="gap-5">
        <FormInput
          label="Street Address"
          placeholder="Enter your street address"
          value={formValues.streetAddress}
          onChangeText={(text) => handleInputChange("streetAddress", text)}
          error={errors.streetAddress?.message as string}
        />

        <FormInput
          label="City"
          placeholder="City"
          value={formValues.city}
          onChangeText={(text) => handleInputChange("city", text)}
          error={errors.city?.message as string}
        />

        <FormInput
          label="State"
          placeholder="State"
          value={formValues.state}
          onChangeText={(text) => handleInputChange("state", text)}
          error={errors.state?.message as string}
        />

        <FormInput
          label="ZIP Code"
          placeholder="ZIP Code"
          value={formValues.zipCode}
          onChangeText={(text) => handleInputChange("zipCode", text)}
          error={errors.zipCode?.message as string}
          keyboardType="number-pad"
        />

        <FormInput
          label="Phone Number"
          placeholder="Phone Number"
          value={formValues.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
          error={errors.phoneNumber?.message as string}
          keyboardType="phone-pad"
        />
      </View>

      {/* Location Section */}
      <View className="mt-7">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Set Location
        </Text>

        <Pressable
          onPress={getCurrentLocation}
          className={`mb-4 flex-row items-center justify-center gap-2 ${
            loadingLocation
              ? "bg-gray-300"
              : "bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
          } px-4 py-3.5 rounded-xl`}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <MapPin size={20} color="white" weight="bold" />
          )}
          <Text className="text-white text-center font-medium">
            {loadingLocation
              ? "Getting your location..."
              : "Use My Current Location"}
          </Text>
        </Pressable>

        {/* Map Container */}
        <View
          className="rounded-xl overflow-hidden border border-gray-200"
          style={{ height: 250 }}
        >
          {position && mapReady ? (
            <MapView
              style={{ width: "100%", height: 250 }}
              initialRegion={{
                ...position,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              onMapReady={() => console.log("Map is ready")}
              onPress={handleMapPress}
            >
              <Marker coordinate={position} />
            </MapView>
          ) : (
            <View className="h-[250px] bg-gray-100 items-center justify-center">
              <MapPin size={32} color="#9ca3af" weight="duotone" />
              <Text className="text-gray-500 mt-2 text-center">
                Tap &quot;Use My Current Location&quot; {"\n"}or set a location
                manually
              </Text>
            </View>
          )}
        </View>

        {position && (
          <Text className="text-xs text-gray-500 text-center mt-2">
            Tap on the map to adjust the pin location if needed
          </Text>
        )}
      </View>

      {/* Default Address toggle with improved styling */}
      <View className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-gray-800 ">
              Set as default address
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              This will be your preferred delivery address
            </Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={(val) => setValue("isDefault", val)}
            trackColor={{ false: "#e5e7eb", true: "#DBD9EE" }}
            thumbColor={isDefault ? "#6C5FBC" : "#f4f3f4"}
            ios_backgroundColor="#e5e7eb"
          />
        </View>
      </View>

      {/* Form Actions */}
      <View className="mt-6">
        <FormActions
          position={position}
          setIsAddingNewAddress={setIsAddingNewAddress}
          onSubmit={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
