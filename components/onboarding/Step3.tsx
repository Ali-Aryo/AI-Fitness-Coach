import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingData } from '../../app/onboarding';

interface Step3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const equipmentOptions = [
  { id: 'dumbbells', name: 'Dumbbells', icon: 'fitness' },
  { id: 'barbell-plates', name: 'Barbell + Plates', icon: 'fitness' },
  { id: 'squat-rack', name: 'Squat Rack', icon: 'fitness' },
  { id: 'adjustable-bench', name: 'Adjustable Bench', icon: 'bed' },
  { id: 'resistance-bands', name: 'Resistance Bands', icon: 'fitness' },
  { id: 'pull-up-bar', name: 'Pull-up Bar', icon: 'fitness' },
  { id: 'kettlebells', name: 'Kettlebells', icon: 'fitness' },
  { id: 'cables-machines', name: 'Cables / Machines', icon: 'fitness' },
  { id: 'treadmill-cardio', name: 'Treadmill / Cardio Machines', icon: 'fitness' },
  { id: 'yoga-mat', name: 'Yoga Mat / Foam Roller', icon: 'fitness' },
  { id: 'none', name: 'None (Bodyweight Only)', icon: 'person' }
];

const locationEquipmentMap = {
  'large-gym': ['dumbbells', 'barbell-plates', 'squat-rack', 'adjustable-bench', 'resistance-bands', 'pull-up-bar', 'kettlebells', 'cables-machines', 'treadmill-cardio', 'yoga-mat'],
  'small-gym': ['dumbbells', 'barbell-plates', 'adjustable-bench', 'resistance-bands', 'pull-up-bar', 'kettlebells', 'yoga-mat'],
  'garage-home': ['dumbbells', 'barbell-plates', 'squat-rack', 'adjustable-bench', 'resistance-bands', 'pull-up-bar', 'kettlebells', 'yoga-mat'],
  'bodyweight-only': ['none'],
  'custom': []
};

export default function Step3({ onNext, data }: Step3Props) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(data.equipment || []);

  // Auto-fill equipment based on location
  useEffect(() => {
    if (data.location && !data.equipment) {
      const autoEquipment = locationEquipmentMap[data.location as keyof typeof locationEquipmentMap] || [];
      setSelectedEquipment(autoEquipment);
    }
  }, [data.location]);

  const toggleEquipment = (equipmentId: string) => {
    if (equipmentId === 'none') {
      setSelectedEquipment(['none']);
    } else {
      setSelectedEquipment(prev => {
        const withoutNone = prev.filter(id => id !== 'none');
        if (prev.includes(equipmentId)) {
          return withoutNone.filter(id => id !== equipmentId);
        } else {
          return [...withoutNone, equipmentId];
        }
      });
    }
  };

  const handleContinue = () => {
    if (selectedEquipment.length > 0) {
      onNext({ equipment: selectedEquipment });
    }
  };

  return (
    <View className="flex-1 py-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-4">
          What equipment do you have access to?
        </Text>
        <Text className="text-slate-400 text-lg">
          Select all equipment you have available (auto-filled based on your location)
        </Text>
      </View>

      {/* Equipment Options */}
      <ScrollView className="flex-1">
        <View className="space-y-3">
          {equipmentOptions.map((equipment) => (
            <TouchableOpacity
              key={equipment.id}
              onPress={() => toggleEquipment(equipment.id)}
              className={`p-4 rounded-xl border-2 ${
                selectedEquipment.includes(equipment.id)
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center mr-4">
                  <Ionicons name={equipment.icon as any} size={20} color="white" />
                </View>
                <Text className="text-white text-lg font-semibold flex-1">
                  {equipment.name}
                </Text>
                {selectedEquipment.includes(equipment.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={selectedEquipment.length === 0}
          className={`p-4 rounded-xl ${
            selectedEquipment.length > 0 ? 'bg-blue-600' : 'bg-slate-700'
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