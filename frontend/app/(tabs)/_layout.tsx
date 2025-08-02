import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a", // slate-900
        },
        headerTintColor: "#3b82f6", // blue-500
        tabBarStyle: {
          backgroundColor: "#0f172a", // slate-900
          borderTopColor: "#1e293b", // slate-800
        },
        tabBarActiveTintColor: "#3b82f6", // blue-500
        tabBarInactiveTintColor: "#64748b", // slate-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 