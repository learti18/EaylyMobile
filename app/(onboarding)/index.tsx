import ButtonHighlight from "@/components/buttons/ButtonHighlight";
import { onboardingSlides } from "@/constants/onboardingSlides";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Image, Text, useWindowDimensions, View } from "react-native";
import { FadeIn } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const OnBoardingScreen = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [activeSlide, setActiveSlide] = useState(0);
  const AnimatedView = Animated.createAnimatedComponent(View);
  const carousel = useRef(null);

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(auth)/login");
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-1 items-center justify-center px-4 mb-10">
      <Image
        source={item.image}
        className="w-80 h-80 mb-8"
        resizeMode="contain"
      />
      <View className="items-center justify-center px-4">
        <Text className="text-5xl font-extrabold text-gray-700 text-center mb-2">
          {item.title}
        </Text>
        <Text className="text-gray-400 text-center text-xl px-6">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background-500">
      <View className="absolute w-80 h-80 bg-primary-100 rounded-full -top-20 -left-20 opacity-50" />
      <Carousel
        ref={carousel}
        loop={false}
        width={width}
        height={height}
        data={onboardingSlides}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index)}
        pagingEnabled
        snapEnabled
        scrollAnimationDuration={300}
      />
      {activeSlide === onboardingSlides.length - 1 && (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="w-full px-4 items-center absolute bottom-32 left-0 right-0"
        >
          <ButtonHighlight
            text="Get Started"
            variant="primary"
            onPress={handleComplete}
          />
        </Animated.View>
      )}

      <View className="absolute bottom-12 left-0 right-0 px-4">
        <View className="flex-row justify-center gap-1.5 mb-6">
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              className={`h-3 rounded-full ${
                activeSlide === index
                  ? "w-11 bg-primary-500"
                  : "w-6 bg-primary-100"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
