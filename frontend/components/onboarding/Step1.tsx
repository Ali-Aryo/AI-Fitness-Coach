import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { OnboardingData } from '../../app/onboarding';

interface Step1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const goals = [
  {
    id: 'get-stronger',
    title: 'Get Stronger',
    description: 'Make measurable progress in strength through progressive overload.',
    icon: 'fitness',
    color: 'bg-blue-600'
  },
  {
    id: 'build-muscle',
    title: 'Build Muscle',
    description: 'Increase muscle size and improve physique with hypertrophy training.',
    icon: 'body',
    color: 'bg-green-600'
  },
  {
    id: 'improve-composition',
    title: 'Improve Body Composition',
    description: 'Build muscle and lose fat simultaneously for a leaner, toned look.',
    icon: 'trending-up',
    color: 'bg-purple-600'
  },
  {
    id: 'reduce-weight',
    title: 'Reduce Body Weight',
    description: 'Lose fat and lower the number on the scale in a sustainable way.',
    icon: 'trending-down',
    color: 'bg-orange-600'
  }
];

export default function Step1({ onNext, onBack, data }: Step1Props) {
  const [selectedGoal, setSelectedGoal] = useState(data.goal || '');

  const handleContinue = () => {
    if (selectedGoal) {
      onNext({ goal: selectedGoal });
    }
  };

  return (
    <View className="flex-1 py-8">
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        className="flex-row items-center mb-6"
      >
        <Ionicons name="arrow-back" size={24} color="#3b82f6" />
        <Text className="text-blue-500 text-lg ml-2">Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-4">
          What's your main goal?
        </Text>
        <Text className="text-slate-400 text-lg">
          Select one option that best describes your primary fitness objective
        </Text>
      </View>

      {/* Goal Options */}
      <View className="space-y-4">
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            onPress={() => setSelectedGoal(goal.id)}
            className={`p-4 rounded-xl border-2 ${
              selectedGoal === goal.id
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full ${goal.color} items-center justify-center mr-4`}>
                <Ionicons name={goal.icon as any} size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                  {goal.title}
                </Text>
                <Text className="text-slate-400 text-sm">
                  {goal.description}
                </Text>
              </View>
              {selectedGoal === goal.id && (
                <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedGoal}
          className={`p-4 rounded-xl ${
            selectedGoal ? 'bg-blue-600' : 'bg-slate-700'
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