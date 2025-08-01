import { useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import { Link, router } from "expo-router";

export default function Index() {
  const { user, loading } = useAuth();

  // Auto-navigate to tabs if user is authenticated
  useEffect(() => {
    if (!loading && user) {
      // @ts-ignore
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4 text-lg">Loading...</Text>
      </View>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Link href="/(tabs)" asChild>
          <View className="items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-white mt-4 text-lg">Welcome back!</Text>
            <Text className="text-slate-400 mt-2">Redirecting to app...</Text>
          </View>
        </Link>
      </View>
    );
  }

  // Show welcome screen with login/signup options
  return (
    <View className="flex-1 bg-slate-900 justify-center px-6">
      {/* Header */}
      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-6">
          <Ionicons name="fitness" size={48} color="white" />
        </View>
        <Text className="text-4xl font-bold text-white mb-4 text-center">
          AI Fitness Coach
        </Text>
        <Text className="text-slate-400 text-center text-lg">
          Your personal fitness journey starts here
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="space-y-4">
        <Link href="/login" asChild>
          <TouchableOpacity className="bg-blue-600 p-4 rounded-xl">
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-in" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Sign In
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/signup" asChild>
          <TouchableOpacity className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <View className="flex-row items-center justify-center">
              <Ionicons name="person-add" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Create Account
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View className="mt-12">
        <Text className="text-slate-400 text-center text-sm">
          Join thousands of users achieving their fitness goals
        </Text>
      </View>
    </View>
  );
} 