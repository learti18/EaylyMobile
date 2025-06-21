import AddressForm from "@/components/order/addressForm";
import DeliveryOptions from "@/components/order/deliveryOptions";
import OrderSummary from "@/components/order/orderSummary";
import { useAddress } from "@/hooks/useAddress";
import { useFetchCart } from "@/queries/useCart";
import api from "@/services/auth/api";
import { AddressFormData } from "@/types/address/address";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useFetchCart();
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<boolean>(false);
  const [paymentSheetReady, setPaymentSheetReady] = useState<boolean>(false);
  const [initializingPayment, setInitializingPayment] =
    useState<boolean>(false);
  const { refetch: refetchCart } = useFetchCart();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
      latitude: null,
      longitude: null,
    },
  });

  const {
    addresses,
    selectedAddressId,
    isAddingNewAddress,
    isLoadingAddresses,
    setIsAddingNewAddress,
    handleAddressSelect,
    onAddressSubmit,
  } = useAddress(reset);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await api.post("/payments/create-payment-intent", {
        addressId: selectedAddressId,
      });
      const { paymentIntent, ephemeralKey, customer, publishableKey } =
        response.data;

      return {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    if (!cart || cart.cartItems.length === 0) {
      console.log("Cart is empty, skipping payment initialization");
      return;
    }

    setInitializingPayment(true);
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Eatly",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: "Customer",
        },
        returnURL: "eatly://payment-complete",
      });

      if (error) {
        console.error("Payment sheet initialization error:", error);
        Toast.show({
          type: "error",
          text1: "Payment initialization failed",
          text2: error.message,
        });
        setPaymentSheetReady(false);
      } else {
        console.log("Payment sheet initialized successfully");
        setPaymentSheetReady(true);
      }
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
      Toast.show({
        type: "error",
        text1: "Payment initialization failed",
        text2: "Please try again",
      });
      setPaymentSheetReady(false);
    } finally {
      setInitializingPayment(false);
    }
  };

  const openPaymentSheet = async () => {
    if (!paymentSheetReady) {
      Toast.show({
        type: "error",
        text1: "Payment not ready",
        text2: "Please wait for payment to initialize",
      });
      return;
    }

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error("Payment sheet error:", error);
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert("Success", "Your order is confirmed!");
        refetchCart();
        router.push("/(app)/basket/tracking");
      }
    } catch (error) {
      console.error("Error presenting payment sheet:", error);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddressId && deliveryType === "delivery") {
      Toast.show({
        type: "error",
        text1: "Please select a delivery address",
      });
      return;
    }

    if (!paymentSheetReady) {
      Toast.show({
        type: "error",
        text1: "Payment not ready",
        text2: "Please wait for payment to initialize",
      });
      return;
    }

    setIsCreatingCheckout(true);
    await openPaymentSheet();
  };

  useEffect(() => {
    if (
      cart &&
      cart.cartItems.length > 0 &&
      !paymentSheetReady &&
      !initializingPayment &&
      selectedAddressId
    ) {
      initializePaymentSheet();
    }
  }, [cart, paymentSheetReady, initializingPayment, selectedAddressId]);

  const subtotal = cart?.totalPrice || 0;
  const deliveryFee = deliveryType === "delivery" ? 3.99 : 0;
  const total = (subtotal + deliveryFee + subtotal * 0.07).toFixed(2);

  if (cartLoading || isLoadingAddresses) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg font-medium text-gray-600">
          Your cart is empty.
        </Text>
        <Pressable
          onPress={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-purple rounded-full"
        >
          <Text className="text-white font-semibold">Browse Menu</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-5">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Complete Your Order
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeft size={20} color="#6b7280" />
          </Pressable>
        </View>

        <DeliveryOptions
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          handleAddressSelect={handleAddressSelect}
          isAddingNewAddress={isAddingNewAddress}
          setIsAddingNewAddress={setIsAddingNewAddress}
          isLoadingAddresses={isLoadingAddresses}
        />

        {deliveryType === "delivery" && isAddingNewAddress && (
          <AddressForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onAddressSubmit}
            setValue={setValue}
            getValues={getValues}
            setIsAddingNewAddress={setIsAddingNewAddress}
          />
        )}

        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />

        <View className="mt-4 mb-10">
          <Pressable
            onPress={handlePayment}
            disabled={
              isCreatingCheckout || initializingPayment || !paymentSheetReady
            }
            className={`px-6 py-4 rounded-xl flex-row items-center justify-center ${
              isCreatingCheckout || initializingPayment || !paymentSheetReady
                ? "bg-gray-400"
                : "bg-primary-500"
            }`}
          >
            {isCreatingCheckout ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white text-lg font-medium ml-2">
                  Processing...
                </Text>
              </>
            ) : initializingPayment ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white text-lg font-medium ml-2">
                  Initializing Payment...
                </Text>
              </>
            ) : !paymentSheetReady ? (
              <Text className="text-white text-lg font-medium">
                Payment Not Ready
              </Text>
            ) : (
              <>
                <Text className="text-white text-lg font-medium mr-2">
                  Proceed to Payment
                </Text>
                <ArrowRight size={18} color="white" />
              </>
            )}
          </Pressable>

          <Text className="text-center text-gray-500 text-xs mt-2">
            You&#39;ll be redirected to our secure payment partner
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
