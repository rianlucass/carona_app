import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LightTheme } from "../constants/theme";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    // Suprime warning conhecido do Expo Router
    LogBox.ignoreLogs([
      "Couldn't find the prevent remove context",
    ]);
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={LightTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
