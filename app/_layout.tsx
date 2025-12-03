import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LightTheme } from "../constants/theme";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={LightTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
