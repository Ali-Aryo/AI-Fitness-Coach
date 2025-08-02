import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { OnboardingData } from '../../app/onboarding';

interface Step8Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const workoutTypes = [
  { id: 'weight-training', name: 'Weight Training', icon: 'fitness' },
  { id: 'cardio', name: 'Cardio', icon: 'fitness' },
  { id: 'hiit', name: 'HIIT', icon: 'flash' },
  { id: 'circuits', name: 'Circuits', icon: 'repeat' },
  { id: 'yoga-mobility', name: 'Yoga / Mobility', icon: 'body' },
  { id: 'sports-functional', name: 'Sports / Functional Training', icon: 'football' }
];

export default function Step8({ onNext, data }: Step8Props) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(data.workoutPreferences || []);
  const [dislikes, setDislikes] = useState(data.dislikes || '');

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        return prev.filter(id => id !== preferenceId);
      } else {
        return [...prev, preferenceId];
      }
    });
  };

  const handleContinue = () => {
    onNext({
      workoutPreferences: selectedPreferences,
      dislikes: dislikes || undefined
    });
  };

  return (
    <ScrollView className="flex-1 py-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-4">
          Preferences
        </Text>
        <Text className="text-slate-400 text-lg">
          Help us create workouts you'll enjoy
        </Text>
      </View>

      {/* Workout Preferences */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          What types of workouts do you enjoy?
        </Text>
        <Text className="text-slate-400 text-sm mb-4">
          Select all that apply
        </Text>
        <View className="space-y-3">
          {workoutTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => togglePreference(type.id)}
              className={`p-4 rounded-xl border-2 ${
                selectedPreferences.includes(type.id)
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center mr-4">
                  <Ionicons name={type.icon as any} size={20} color="white" />
                </View>
                <Text className="text-white text-lg font-semibold flex-1">
                  {type.name}
                </Text>
                {selectedPreferences.includes(type.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dislikes */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          Anything you dislike or want to avoid?
        </Text>
        <Text className="text-slate-400 text-sm mb-4">
          Optional - helps us customize your experience
        </Text>
        <TextInput
          value={dislikes}
          onChangeText={setDislikes}
          placeholder="e.g., running, burpees, long workouts..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={3}
          className="bg-slate-800 p-4 rounded-xl text-white text-lg"
        />
      </View>

      {/* Continue Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={selectedPreferences.length === 0}
          className={`p-4 rounded-xl ${
            selectedPreferences.length > 0 ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Complete Setup
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 