import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
