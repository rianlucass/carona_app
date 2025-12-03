import { View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text className="text-xl font-semibold mb-4">ViaCarona</Text>

      <Button mode="contained" onPress={() => {}}>
        Teste Paper + NativeWind
      </Button>
    </View>
  );
}
