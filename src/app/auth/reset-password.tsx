import { resetPassword } from "@/src/api/services/(auth)/passwordReset";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Pega o token da URL ao carregar a tela
  useEffect(() => {
    if (params.token && typeof params.token === "string") {
      setToken(params.token);
    }
  }, [params.token]);

  // Validação de senha forte
  const isStrongPassword = (password: string) => {
    // Mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleResetPassword = async () => {
    // Validações
    if (!token) {
      setErrorModalMessage("Token inválido ou ausente");
      setErrorModalVisible(true);
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorModalMessage("Preencha todos os campos");
      setErrorModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorModalMessage("As senhas não coincidem");
      setErrorModalVisible(true);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setErrorModalMessage(
        "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial"
      );
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setIsLoading(false);
      setSuccessModalVisible(true);
    } catch (error: any) {
      setIsLoading(false);

      // Tratamento de erros
      if (error instanceof TypeError && error.message === "Network request failed") {
        setErrorModalMessage("Erro de conexão. Verifique se a API está rodando e tente novamente.");
      } else if (error?.errorCode === "INVALID_TOKEN") {
        setErrorModalMessage(error?.message || "Token inválido ou já utilizado");
      } else if (error?.errorCode === "TOKEN_EXPIRED") {
        setErrorModalMessage(error?.message || "Token expirado. Solicite um novo link de redefinição");
      } else if (error?.errorCode === "INVALID_PASSWORD") {
        setErrorModalMessage(error?.message || "As senhas não coincidem ou são inválidas");
      } else if (error?.errorCode === "VALIDATION_ERROR") {
        setErrorModalMessage(error?.message || "Dados inválidos. Verifique os campos.");
      } else {
        setErrorModalMessage(error?.message || "Erro ao redefinir senha. Tente novamente.");
      }
      setErrorModalVisible(true);
      console.error("Erro ao resetar senha:", error);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={30}
        extraHeight={120}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-900"
            disabled={isLoading}
          >
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-4xl font-bold mt-6 mb-2">
            Redefinir senha
          </Text>
          <Text className="text-gray-400 text-base">
            Crie uma nova senha forte
          </Text>
        </View>

        {/* Formulário */}
        <View className="flex-1 bg-white rounded-t-[32px] px-6 pt-8">
          {/* Nova senha */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              Nova senha
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 bg-gray-50">
              <Lock size={20} color="#9ca3af" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Digite sua nova senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                className="flex-1 py-4 px-3 text-base text-gray-900"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar senha */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              Confirmar senha
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 bg-gray-50">
              <Lock size={20} color="#9ca3af" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Digite novamente sua senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                className="flex-1 py-4 px-3 text-base text-gray-900"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Requisitos de senha */}
          <View className="mb-6 p-4 bg-[#10b981]/10 rounded-xl">
            <Text className="text-sm text-gray-700 font-semibold mb-2">
              Requisitos da senha:
            </Text>
            <Text className="text-sm text-gray-600">• Mínimo 8 caracteres</Text>
            <Text className="text-sm text-gray-600">• Letra maiúscula e minúscula</Text>
            <Text className="text-sm text-gray-600">• Pelo menos um número</Text>
            <Text className="text-sm text-gray-600">• Caractere especial (@$!%*?&#)</Text>
          </View>

          {/* Botão de redefinir */}
          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            buttonColor="#10b981"
            textColor="#fff"
            style={{
              paddingVertical: 8,
              marginBottom: 24,
            }}
            labelStyle={{ fontSize: 16, fontWeight: "600" }}
          >
            Redefinir senha
          </Button>

          {/* Link para voltar ao login */}
          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              onPress={() => router.replace("/auth/login")}
              disabled={isLoading}
            >
              <Text className="text-[#3b4f76] font-bold text-sm">
                Voltar para o login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal de Erro */}
      <Portal>
        <Modal
          visible={errorModalVisible}
          onDismiss={() => setErrorModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 24,
          }}
        >
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <AlertCircle size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Ops! Algo está errado
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              {errorModalMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setErrorModalVisible(false)}
              className="w-full bg-red-500 rounded-xl py-3"
            >
              <Text className="text-white text-center font-semibold text-base">
                Entendi
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      {/* Modal de Sucesso */}
      <Portal>
        <Modal
          visible={successModalVisible}
          onDismiss={handleSuccessClose}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 24,
          }}
        >
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
              <CheckCircle2 size={32} color="#10b981" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Senha redefinida!
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </Text>
            <TouchableOpacity
              onPress={handleSuccessClose}
              className="w-full bg-[#10b981] rounded-xl py-3"
            >
              <Text className="text-white text-center font-semibold text-base">
                Ir para o login
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
