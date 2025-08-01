import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
//@ts-ignore
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-900"
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="person-add" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            Create Account
          </Text>
          <Text className="text-slate-400 text-center">
            Join us and start your fitness journey
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-white font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-white font-semibold mb-2">Password</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-white font-semibold mb-2">Confirm Password</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
              placeholder="Confirm your password"
              placeholderTextColor="#64748b"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`p-4 rounded-xl mt-6 ${loading ? 'bg-slate-600' : 'bg-blue-600'}`}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-400">Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 