import { CaretDown, MapPin } from "phosphor-react-native";
import { Image, Text, View } from "react-native";

function Header() {
    return ( 
        <View className="flex-row justify-between items-center px-5 pt-5 pb-2.5 bg-gray-100">
          <View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#8A2BE2" />
              <Text className="text-xs text-gray-500 ml-1">Location</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-base font-bold text-gray-800">California, USA </Text>
                <CaretDown size={16} color="#333" weight="bold" />
            </View>
          </View>
          <Image
            source={{ uri: 'https://picsum.photos/40/40?random=0' }}
            className="w-10 h-10 rounded-full"
          />
        </View>     
     );
}

export default Header;