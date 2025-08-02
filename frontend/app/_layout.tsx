import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: true,
            title: "Setup",
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { color: '#ffffff' }
          }} 
        />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
