import { MagnifyingGlass } from "phosphor-react-native";
import React from "react";
import { TextInput, View } from "react-native";

interface Props {
  placeholder: string;
  //   onPress?: () => void;
  //   onChangeText: (text: string) => void;
  value: string;
}

const SearchBar = ({ placeholder, value }: Props) => {
  return (
    <View className="flex-1 flex-row bg-white items-center rounded-2xl p-5 ">
      <MagnifyingGlass size={26} color="#d1d5db" weight="bold" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#a8b5db"
        onChangeText={() => console.log("changed")}
        value={value}
        onPress={() => console.log("pressed")}
        className="flex-1 ml-2 text-gray-400"
      />
    </View>
  );
};

export default SearchBar;
