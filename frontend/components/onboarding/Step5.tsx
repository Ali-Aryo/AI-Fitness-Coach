import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingData } from '../../app/onboarding';

interface Step5Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function Step5({ onNext, onBack, data }: Step5Props) {
  const [age, setAge] = useState(data.age?.toString() || '');
  const [gender, setGender] = useState(data.gender || '');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState(data.bodyFat?.toString() || '');
  const [useMetric, setUseMetric] = useState(false);

  const handleContinue = () => {
    if (age && gender && weight) {
      const height = useMetric 
        ? { cm: parseInt(heightFeet) }
        : { feet: parseInt(heightFeet), inches: parseInt(heightInches) };
      
      const weightData = useMetric 
        ? { kg: parseFloat(weight) }
        : { lbs: parseFloat(weight) };

      onNext({
        age: parseInt(age),
        gender,
        height,
        weight: weightData,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined
      });
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
          Your Body
        </Text>
        <Text className="text-slate-400 text-lg">
          Help us create personalized workouts
        </Text>
      </View>

      {/* Age */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-white mb-3">Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          className="bg-slate-800 p-4 rounded-xl text-white text-lg"
        />
      </View>

      {/* Gender */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-white mb-3">Gender</Text>
        <View className="space-y-2">
          {genders.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              className={`p-4 rounded-xl border-2 ${
                gender === g ? 'border-blue-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <Text className="text-white text-lg text-center">{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Height */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-white mb-3">Height</Text>
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => setUseMetric(false)}
            className={`px-4 py-2 rounded-lg mr-2 ${
              !useMetric ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <Text className="text-white">Feet/Inches</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUseMetric(true)}
            className={`px-4 py-2 rounded-lg ${
              useMetric ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <Text className="text-white">cm</Text>
          </TouchableOpacity>
        </View>
        {!useMetric ? (
          <View className="flex-row space-x-2">
            <TextInput
              value={heightFeet}
              onChangeText={setHeightFeet}
              placeholder="Feet"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              className="flex-1 bg-slate-800 p-4 rounded-xl text-white text-lg"
            />
            <TextInput
              value={heightInches}
              onChangeText={setHeightInches}
              placeholder="Inches"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              className="flex-1 bg-slate-800 p-4 rounded-xl text-white text-lg"
            />
          </View>
        ) : (
          <TextInput
            value={heightFeet}
            onChangeText={setHeightFeet}
            placeholder="Height in cm"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            className="bg-slate-800 p-4 rounded-xl text-white text-lg"
          />
        )}
      </View>

      {/* Weight */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-white mb-3">Weight</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder={useMetric ? "Weight in kg" : "Weight in lbs"}
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          className="bg-slate-800 p-4 rounded-xl text-white text-lg"
        />
      </View>

      {/* Body Fat (Optional) */}
      <View className="mb-8">
        <Text className="text-xl font-semibold text-white mb-3">Body Fat % (Optional)</Text>
        <TextInput
          value={bodyFat}
          onChangeText={setBodyFat}
          placeholder="Enter body fat percentage"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          className="bg-slate-800 p-4 rounded-xl text-white text-lg"
        />
      </View>

      {/* Continue Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!age || !gender || !weight}
          className={`p-4 rounded-xl ${
            age && gender && weight ? 'bg-blue-600' : 'bg-slate-700'
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