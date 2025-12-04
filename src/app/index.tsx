import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Welcome() {

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <Text>Welcome Screen</Text>
    </View>
  );
}
