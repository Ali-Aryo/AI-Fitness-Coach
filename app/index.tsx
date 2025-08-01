import { Redirect } from "expo-router";

export default function Index() {
  // For now, redirect to the tabs
  // In the future, this would contain login logic
  return <Redirect href="/(tabs)" />;
} 