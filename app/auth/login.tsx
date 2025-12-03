import { View, Text } from "react-native";
import { AppInput } from "../../components/appInput";
import { AppButton } from "../../components/appButton";

export default function Login() {
  return (
    <View className="flex-1 justify-center p-5 bg-background">
      <Text className="text-2xl font-semibold mb-4">Entrar</Text>

      <AppInput label="Email" />
      <AppInput label="Senha" secureTextEntry />

      <AppButton onPress={() => {}}>
        Fazer login
      </AppButton>
    </View>
  );
}
