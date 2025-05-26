import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Gear, Lock, Question, SignOut } from "phosphor-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg";

function getSecurityLevel() {
  return {
    label: "Excellent",
    color: "#A1A1AA",
    progress: 0.85,
  };
}

function ProfileOption({ icon: Icon, label, onPress, children }: { icon: React.ElementType; label: string; onPress: () => void; children?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-4 px-6">
      <Icon size={24} color="#6C5FBC" weight="bold" />
      <Text className="ml-4 text-base font-medium text-gray-800 flex-1">{label}</Text>
      {children}
      <Text className="text-2xl text-gray-300">›</Text>
    </Pressable>
  );
}

const Profile: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const security = getSecurityLevel();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <View className="items-center mt-12 mb-6">
        <Image source={{ uri: AVATAR_URL }} className="w-28 h-28 rounded-full border-4 border-white" />
        <View className="mt-4 items-center">
          <Text className="text-2xl font-extrabold text-gray-900">Joseph Ren</Text>
          <Text className="text-base text-gray-400">@JosephR</Text>
        </View>
        <View className="mt-4 w-20 h-12 bg-[#6C5FBC] rounded-2xl items-center justify-center">
          <Question size={28} color="#fff" weight="bold" />
        </View>
      </View>
      <View className="bg-white rounded-3xl mx-4 py-2 shadow-sm">
        <ProfileOption icon={Gear} label="Preferences" onPress={() => router.push("/profile/preferences")}/>
        <View className="px-6">
          <Pressable onPress={() => {}} className="flex-row items-center py-4">
            <Lock size={24} color="#6C5FBC" weight="bold" />
            <Text className="ml-4 text-base font-medium text-gray-800 flex-1">Account Security</Text>
          </Pressable>
          <View className="w-full h-2 bg-gray-200 rounded-full mt-1 mb-1">
            <View style={{ width: `${security.progress * 100}%`, backgroundColor: "#6C5FBC" }} className="h-2 rounded-full" />
          </View>
          <Text className="text-xs text-gray-400 mt-1">{security.label}</Text>
        </View>
        <ProfileOption icon={Question} label="Customer Support" onPress={() => {}}/>
        <ProfileOption icon={SignOut} label="Logout" onPress={handleLogout}/>
      </View>
    </View>
  );
};

export default Profile;
