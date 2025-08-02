import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SchedulePage() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const scheduledWorkouts = [
    { day: 15, workout: "Upper Body", time: "9:00 AM", type: "strength" },
    { day: 17, workout: "Cardio", time: "7:00 AM", type: "cardio" },
    { day: 19, workout: "Leg Day", time: "6:00 PM", type: "strength" },
    { day: 22, workout: "Yoga", time: "8:00 AM", type: "flexibility" },
  ];

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-blue-600";
      case "cardio":
        return "bg-red-600";
      case "flexibility":
        return "bg-green-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white mb-2">Schedule</Text>
            <Text className="text-slate-400">Plan your fitness journey</Text>
          </View>

          {/* Calendar Header */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity>
                <Ionicons name="chevron-back" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-white">
                December 2024
              </Text>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View className="flex-row mb-2">
              {daysOfWeek.map((day, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-slate-400 text-sm font-medium">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const hasWorkout = scheduledWorkouts.find((w) => w.day === day);
                const isToday = day === currentDay;

                return (
                  <TouchableOpacity
                    key={i}
                    className={`w-[14.28%] h-12 items-center justify-center ${
                      isToday ? "bg-blue-600 rounded-full" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isToday ? "text-white font-bold" : "text-white"
                      }`}
                    >
                      {day}
                    </Text>
                    {hasWorkout && (
                      <View
                        className={`w-2 h-2 rounded-full mt-1 ${getWorkoutTypeColor(
                          hasWorkout.type
                        )}`}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Upcoming Workouts */}
          <View>
            <Text className="text-xl font-semibold text-white mb-4">
              Upcoming Workouts
            </Text>
            {scheduledWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={index}
                className="bg-slate-800 p-4 rounded-xl mb-3"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View
                      className={`w-3 h-3 rounded-full mr-3 ${getWorkoutTypeColor(
                        workout.type
                      )}`}
                    />
                    <View>
                      <Text className="text-white font-semibold text-lg">
                        {workout.workout}
                      </Text>
                      <Text className="text-slate-400">
                        Dec {workout.day} • {workout.time}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Workout Button */}
          <TouchableOpacity className="bg-blue-600 p-4 rounded-xl mt-6">
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Schedule Workout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
