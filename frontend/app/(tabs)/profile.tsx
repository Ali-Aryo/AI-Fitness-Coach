import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const userStats = [
    { label: "Workouts", value: "24", icon: "fitness" as const },
    { label: "Streak", value: "7 days", icon: "flame" as const },
    { label: "Calories", value: "12,450", icon: "trophy" as const },
    { label: "Time", value: "18h", icon: "time" as const },
  ];

  const achievements = [
    {
      name: "First Workout",
      description: "Completed your first workout",
      icon: "star" as const,
      earned: true,
    },
    {
      name: "Week Warrior",
      description: "Worked out 7 days in a row",
      icon: "trophy" as const,
      earned: true,
    },
    {
      name: "Strength Master",
      description: "Complete 50 strength workouts",
      icon: "barbell" as const,
      earned: false,
    },
  ];

  const menuItems = [
    { title: "Edit Profile", icon: "person" as const },
    { title: "Settings", icon: "settings" as const },
    { title: "Goals", icon: "target" as const },
    { title: "Progress", icon: "trending-up" as const },
    { title: "Help & Support", icon: "help-circle" as const },
    { title: "About", icon: "information-circle" as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        <View className="p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">John Doe</Text>
          <Text className="text-slate-400 mb-4">Fitness Enthusiast</Text>
          <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-full">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            This Month
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {userStats.map((stat, index) => (
              <View
                key={index}
                className="bg-slate-800 w-[48%] p-4 rounded-xl mb-3"
              >
                <View className="items-center">
                  <Ionicons name={stat.icon} size={24} color="#3b82f6" />
                  <Text className="text-white text-xl font-bold mt-2">
                    {stat.value}
                  </Text>
                  <Text className="text-slate-400 text-sm">{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            Achievements
          </Text>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              className={`bg-slate-800 p-4 rounded-xl mb-3 ${
                achievement.earned ? "" : "opacity-50"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    achievement.earned ? "bg-blue-600" : "bg-slate-600"
                  }`}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={20}
                    color={achievement.earned ? "white" : "#64748b"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-lg ${
                      achievement.earned ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {achievement.name}
                  </Text>
                  <Text className="text-slate-400">
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View>
          <Text className="text-xl font-semibold text-white mb-4">
            Settings
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-slate-800 p-4 rounded-xl mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name={item.icon} size={24} color="#3b82f6" />
                  <Text className="text-white text-lg ml-3">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-xl mt-8"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
