import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
//@ts-ignore
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
            <Ionicons name="fitness" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </Text>
          <Text className="text-slate-400 text-center">
            Sign in to continue your fitness journey
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

          <TouchableOpacity
            className={`p-4 rounded-xl mt-6 ${loading ? 'bg-slate-600' : 'bg-blue-600'}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-400">Don't have an account? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 