import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutPage() {
  const workoutCategories = [
    { name: "Strength Training", icon: "fitness" as const, color: "bg-blue-600" },
    { name: "Cardio", icon: "heart" as const, color: "bg-red-600" },
    { name: "Flexibility", icon: "body" as const, color: "bg-green-600" },
    { name: "HIIT", icon: "flash" as const, color: "bg-purple-600" },
  ];

  const recentWorkouts = [
    { name: "Upper Body", duration: "45 min", date: "Today" },
    { name: "Cardio Session", duration: "30 min", date: "Yesterday" },
    { name: "Leg Day", duration: "60 min", date: "2 days ago" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Workout
          </Text>
          <Text className="text-slate-400">
            Ready to crush your fitness goals?
          </Text>
        </View>

        {/* Quick Start Button */}
        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl mb-6">
          <View className="flex-row items-center justify-center">
            <Ionicons name="play" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Start Workout
            </Text>
          </View>
        </TouchableOpacity>

        {/* Workout Categories */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-white mb-4">
            Workout Types
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {workoutCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className={`${category.color} w-[48%] p-4 rounded-xl mb-3`}
              >
                <View className="items-center">
                  <Ionicons name={category.icon} size={32} color="white" />
                  <Text className="text-white font-semibold mt-2 text-center">
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Workouts */}
        <View>
          <Text className="text-xl font-semibold text-white mb-4">
            Recent Workouts
          </Text>
          {recentWorkouts.map((workout, index) => (
            <TouchableOpacity
              key={index}
              className="bg-slate-800 p-4 rounded-xl mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold text-lg">
                    {workout.name}
                  </Text>
                  <Text className="text-slate-400">{workout.duration}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-slate-400 text-sm">{workout.date}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
