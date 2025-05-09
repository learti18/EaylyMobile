import React from "react";
import {
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from "react-native";

interface ButtonHighlightProps extends TouchableHighlightProps {
  text: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const ButtonHighlight = ({
  text,
  variant = "primary",
  className,
  ...props
}: ButtonHighlightProps) => {
  return (
    <TouchableHighlight
      underlayColor="#5c4eae"
      className={`bg-primary-500 bg-primar rounded-2xl px-5 w-full ${className}`}
      onPress={props.onPress}
      {...props}
    >
      <Text className="text-white text-center font-semibold text-xl leading-[56px]">
        {text}
      </Text>
    </TouchableHighlight>
  );
};

export default ButtonHighlight;
