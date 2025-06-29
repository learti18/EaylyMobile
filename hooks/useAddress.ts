import api from "@/services/auth/api";
import { Address, AddressFormData } from "@/types/address/address";
import { useEffect, useState } from "react";
import { UseFormReset } from "react-hook-form";
import Toast from "react-native-toast-message";

export const useAddress = (reset: UseFormReset<AddressFormData>) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(true);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await api.get<Address[]>("/user/addresses");
      setAddresses(response.data || []);
      const defaultAddress = response.data?.find(
        (address) => address.isDefault
      );
      setSelectedAddressId(
        defaultAddress?.id || response.data?.[0]?.id || null
      );
      if (!response.data?.length) setIsAddingNewAddress(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to load addresses",
        text2:
          error instanceof Error
            ? error.message
            : "An error occurred while loading addresses.",
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressSelect = (id: number) => {
    setSelectedAddressId(id);
    setIsAddingNewAddress(false);
  };
  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      const response = await api.post<Address>("/user/addresses", data);
      const newAddress: Address = response.data;
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setIsAddingNewAddress(false);
      fetchAddresses();
      reset();
      Toast.show({ type: "success", text1: "Address added successfully" });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to add address",
        text2:
          error instanceof Error
            ? error.message
            : "An error occurred while adding the address.",
      });
    }
  };

  const onDeleteAddress = async (addressId: number) => {
    try {
      await api.delete(`/user/addresses/${addressId}`);

      fetchAddresses();

      if (selectedAddressId === addressId) {
        const remainingAddresses = addresses.filter(
          (address) => address.id !== addressId
        );
        if (remainingAddresses.length > 0) {
          const defaultAddress = remainingAddresses.find(
            (address) => address.isDefault
          );
          setSelectedAddressId(defaultAddress?.id || remainingAddresses[0].id);
        } else {
          setSelectedAddressId(null);
          setIsAddingNewAddress(true);
        }
      }

      Toast.show({
        type: "success",
        text1: "Address deleted successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete address",
        text2:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the address.",
      });
    }
  };

  return {
    addresses,
    selectedAddressId,
    isAddingNewAddress,
    isLoadingAddresses,
    setIsAddingNewAddress,
    handleAddressSelect,
    onAddressSubmit,
    onDeleteAddress,
  };
};
