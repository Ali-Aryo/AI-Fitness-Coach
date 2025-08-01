import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { OnboardingData } from '../../app/onboarding';

interface Step7Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export default function Step7({ onNext, data }: Step7Props) {
  const [hasInjuries, setHasInjuries] = useState<boolean | undefined>(undefined);
  const [injuries, setInjuries] = useState(data.injuries || '');
  const [hasMedicalConditions, setHasMedicalConditions] = useState<boolean | undefined>(undefined);
  const [medicalConditions, setMedicalConditions] = useState(data.medicalConditions || '');

  const handleContinue = () => {
    onNext({
      injuries: hasInjuries ? injuries : undefined,
      medicalConditions: hasMedicalConditions ? medicalConditions : undefined
    });
  };

  return (
    <ScrollView className="flex-1 py-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-4">
          Health & Limitations
        </Text>
        <Text className="text-slate-400 text-lg">
          Help us create safe and effective workouts
        </Text>
      </View>

      {/* Injuries */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          Any current injuries or limitations?
        </Text>
        <View className="flex-row space-x-4 mb-4">
          <TouchableOpacity
            onPress={() => setHasInjuries(true)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasInjuries === true
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHasInjuries(false)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasInjuries === false
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">No</Text>
          </TouchableOpacity>
        </View>
        
        {hasInjuries && (
          <TextInput
            value={injuries}
            onChangeText={setInjuries}
            placeholder="Describe your injuries or limitations..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            className="bg-slate-800 p-4 rounded-xl text-white text-lg"
          />
        )}
      </View>

      {/* Medical Conditions */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          Any medical conditions?
        </Text>
        <View className="flex-row space-x-4 mb-4">
          <TouchableOpacity
            onPress={() => setHasMedicalConditions(true)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasMedicalConditions === true
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHasMedicalConditions(false)}
            className={`flex-1 p-4 rounded-xl border-2 ${
              hasMedicalConditions === false
                ? 'border-blue-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <Text className="text-white text-lg font-semibold text-center">No</Text>
          </TouchableOpacity>
        </View>
        
        {hasMedicalConditions && (
          <TextInput
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            placeholder="Describe your medical conditions..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            className="bg-slate-800 p-4 rounded-xl text-white text-lg"
          />
        )}
      </View>

      {/* Continue Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleContinue}
          className="p-4 rounded-xl bg-blue-600"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 