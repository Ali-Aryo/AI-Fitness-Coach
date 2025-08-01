import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { OnboardingData } from '../../app/onboarding';

interface Step4Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const experienceLevels = [
  { id: 'beginner', title: 'Beginner', description: 'New to fitness or returning after a long break', color: 'bg-green-600' },
  { id: 'intermediate', title: 'Intermediate', description: 'Some experience with structured training', color: 'bg-yellow-600' },
  { id: 'advanced', title: 'Advanced', description: 'Experienced with consistent training', color: 'bg-red-600' }
];

export default function Step4({ onNext, data }: Step4Props) {
  const [experience, setExperience] = useState(data.experience || '');
  const [hasStructuredPlan, setHasStructuredPlan] = useState<boolean | undefined>(data.hasStructuredPlan);

  const handleContinue = () => {
    if (experience && hasStructuredPlan !== undefined) {
      onNext({ experience, hasStructuredPlan });
    }
  };

  return (
    <View className="flex-1 py-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-4">
          Your Experience
        </Text>
        <Text className="text-slate-400 text-lg">
          Help us understand your fitness background
        </Text>
      </View>

      {/* Experience Level */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          What's your current fitness level?
        </Text>
        <View className="space-y-3">
          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => setExperience(level.id)}
              className={`p-4 rounded-xl border-2 ${
                experience === level.id
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full ${level.color} items-center justify-center mr-4`}>
                  <Ionicons name="fitness" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    {level.title}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {level.description}
                  </Text>
                </View>
                {experience === level.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Structured Plan Question */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          Have you followed a structured workout plan before?
        </Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={() => setHasStructuredPlan(true)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasStructuredPlan === true
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHasStructuredPlan(false)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasStructuredPlan === false
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">No</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Button */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!experience || hasStructuredPlan === undefined}
          className={`p-4 rounded-xl ${
            experience && hasStructuredPlan !== undefined ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 