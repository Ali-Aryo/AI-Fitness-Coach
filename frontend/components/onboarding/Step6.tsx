import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingData } from '../../app/onboarding';

interface Step6Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const sessionLengths = [15, 30, 45, 60, 90];
const preferredTimes = ['Morning', 'Afternoon', 'Evening', 'No preference'];

export default function Step6({ onNext, onBack, data }: Step6Props) {
  const [daysPerWeek, setDaysPerWeek] = useState(data.daysPerWeek || 3);
  const [sessionLength, setSessionLength] = useState(data.sessionLength || 45);
  const [preferredTime, setPreferredTime] = useState(data.preferredTime || '');

  const handleContinue = () => {
    if (preferredTime) {
      onNext({ daysPerWeek, sessionLength, preferredTime });
    }
  };

  return (
    <ScrollView className="flex-1 py-8">
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
          Schedule & Commitment
        </Text>
        <Text className="text-slate-400 text-lg">
          Help us create a realistic workout plan
        </Text>
      </View>

      {/* Days per Week */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          How many days/week can you work out?
        </Text>
        <View className="flex-row flex-wrap justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setDaysPerWeek(day)}
              className={`w-12 h-12 rounded-full items-center justify-center m-1 ${
                daysPerWeek === day ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <Text className="text-white font-semibold">{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-slate-400 text-center mt-2">
          {daysPerWeek} day{daysPerWeek !== 1 ? 's' : ''} per week
        </Text>
      </View>

      {/* Session Length */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          How long is each session?
        </Text>
        <View className="space-y-2">
          {sessionLengths.map((length) => (
            <TouchableOpacity
              key={length}
              onPress={() => setSessionLength(length)}
              className={`p-4 rounded-xl border-2 ${
                sessionLength === length
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <Text className="text-white text-lg text-center">
                {length} minute{length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Preferred Time */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-4">
          Preferred workout time?
        </Text>
        <View className="space-y-2">
          {preferredTimes.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setPreferredTime(time)}
              className={`p-4 rounded-xl border-2 ${
                preferredTime === time
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <Text className="text-white text-lg text-center">{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!preferredTime}
          className={`p-4 rounded-xl ${
            preferredTime ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 