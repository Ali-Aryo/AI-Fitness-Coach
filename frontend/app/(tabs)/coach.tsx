import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { aiApi } from "../../lib/api/ai";
import { ERROR_MESSAGES } from "../../lib/utils/constants";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI fitness coach. I'm here to help you with workout advice, nutrition tips, and fitness guidance. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Use the API service instead of direct fetch
      const response = await aiApi.getFitnessAdvice({
        question: userMessage.text,
        context: "User is asking for fitness advice through the app",
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data?.advice || "Sorry, I couldn't generate a response.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: ERROR_MESSAGES.NETWORK_ERROR,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View className="bg-slate-800 px-4 py-3 border-b border-slate-700">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="fitness" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">
                AI Fitness Coach
              </Text>
              <Text className="text-slate-400 text-sm">
                Always here to help
              </Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-2"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? "bg-blue-500 rounded-br-md"
                    : "bg-slate-700 rounded-bl-md"
                }`}
              >
                <Text
                  className={`text-sm ${message.isUser ? "text-white" : "text-slate-200"}`}
                >
                  {message.text}
                </Text>
                <Text
                  className={`text-xs mt-1 ${
                    message.isUser ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text className="text-slate-400 text-sm ml-2">
                    Coach is typing...
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions - Horizontal Scrollable */}
        <View className="bg-slate-900 px-4 pt-3 pb-1 border-t border-slate-700">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            <TouchableOpacity
              onPress={() =>
                setInputText("How can I improve my workout routine?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Workout Tips</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText("What should I eat before and after working out?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText(
                  "I'm feeling unmotivated, help me get back on track"
                )
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Motivation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText("What exercises should I do for my abs?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Core Workouts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText("How can I build muscle effectively?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Muscle Building</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setInputText("What's a good cardio routine?")}
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Cardio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText("How should I warm up before exercising?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Warm Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputText("What's the best way to recover after a workout?")
              }
              className="bg-slate-700 px-4 py-2 rounded-full mr-3"
            >
              <Text className="text-slate-300 text-sm">Recovery</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Input */}
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-full mr-3"
              placeholder="Ask your coach anything..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              style={{ minHeight: 44 }}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                inputText.trim() && !isLoading ? "bg-blue-500" : "bg-slate-600"
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && !isLoading ? "white" : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
