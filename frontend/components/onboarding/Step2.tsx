import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { OnboardingData } from '../../app/onboarding';

interface Step2Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const locations = [
  {
    id: 'large-gym',
    title: 'Large Gym',
    description: 'Full commercial gym with machines, cables, barbells, cardio equipment.',
    icon: 'fitness',
    color: 'bg-blue-600'
  },
  {
    id: 'small-gym',
    title: 'Small Gym',
    description: 'Limited setup like a condo, hotel, or minimalist gym.',
    icon: 'business',
    color: 'bg-green-600'
  },
  {
    id: 'garage-home',
    title: 'Garage/Home Gym',
    description: 'Your own equipment like dumbbells, rack, bands, etc.',
    icon: 'home',
    color: 'bg-purple-600'
  },
  {
    id: 'bodyweight-only',
    title: 'Home (Bodyweight Only)',
    description: 'No equipment, just your body.',
    icon: 'person',
    color: 'bg-orange-600'
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Manually select exactly what equipment you have.',
    icon: 'settings',
    color: 'bg-gray-600'
  }
];

export default function Step2({ onNext, onBack, data }: Step2Props) {
  const [selectedLocation, setSelectedLocation] = useState(data.location || '');

  const handleContinue = () => {
    if (selectedLocation) {
      onNext({ location: selectedLocation });
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
          Where do you exercise?
        </Text>
        <Text className="text-slate-400 text-lg">
          Select one option that best describes your workout environment
        </Text>
      </View>

      {/* Location Options */}
      <View className="space-y-4">
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            onPress={() => setSelectedLocation(location.id)}
            className={`p-4 rounded-xl border-2 ${
              selectedLocation === location.id
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full ${location.color} items-center justify-center mr-4`}>
                <Ionicons name={location.icon as any} size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                  {location.title}
                </Text>
                <Text className="text-slate-400 text-sm">
                  {location.description}
                </Text>
              </View>
              {selectedLocation === location.id && (
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
          disabled={!selectedLocation}
          className={`p-4 rounded-xl ${
            selectedLocation ? 'bg-blue-600' : 'bg-slate-700'
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