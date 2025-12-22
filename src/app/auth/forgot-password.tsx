import { requestPasswordReset } from "@/src/api/services/(auth)/passwordReset";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Validação simples
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRequestReset = async () => {
    // Validações
    if (!email.trim()) {
      setErrorModalMessage("Por favor, informe seu email");
      setErrorModalVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorModalMessage("Email inválido");
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset({ email: email.trim() });
      
      setIsLoading(false);
      setSuccessModalVisible(true);
    } catch (error: any) {
      setIsLoading(false);
      
      // Tratamento de erros
      if (error instanceof TypeError && error.message === "Network request failed") {
        setErrorModalMessage("Erro de conexão. Verifique se a API está rodando e tente novamente.");
      } else if (error?.errorCode === "USER_NOT_FOUND") {
        setErrorModalMessage(error?.message || "Usuário não encontrado. Verifique o email informado.");
      } else if (error?.errorCode === "EMAIL_SENDING_ERROR") {
        setErrorModalMessage(error?.message || "Falha ao enviar email. Tente novamente mais tarde.");
      } else if (error?.errorCode === "VALIDATION_ERROR") {
        setErrorModalMessage(error?.message || "Dados inválidos. Verifique o email informado.");
      } else {
        setErrorModalMessage(error?.message || "Erro ao processar solicitação. Tente novamente.");
      }
      setErrorModalVisible(true);
      console.error("Erro ao solicitar reset:", error);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    router.back();
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
            Esqueci minha senha
          </Text>
          <Text className="text-gray-400 text-base">
            Informe seu email para recuperação
          </Text>
        </View>

        {/* Formulário */}
        <View className="flex-1 bg-white rounded-t-[32px] px-6 pt-8">
          {/* Instruções */}
          <View className="mb-6">
            <Text className="text-base text-gray-600 leading-6">
              Enviaremos um link para redefinir sua senha no email cadastrado.
            </Text>
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              Email
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 bg-gray-50">
              <Mail size={20} color="#9ca3af" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isLoading}
                className="flex-1 py-4 px-3 text-base text-gray-900"
              />
            </View>
          </View>

          {/* Botão de enviar */}
          <Button
            mode="contained"
            onPress={handleRequestReset}
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
            Enviar link de recuperação
          </Button>

          {/* Link para voltar ao login */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">
              Lembrou sua senha?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <Text className="text-[#3b4f76] font-bold text-sm">
                Fazer login
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
              Email enviado!
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Enviamos um email com instruções para redefinir sua senha. Verifique sua caixa de entrada.
            </Text>
            <TouchableOpacity
              onPress={handleSuccessClose}
              className="w-full bg-[#10b981] rounded-xl py-3"
            >
              <Text className="text-white text-center font-semibold text-base">
                Entendi
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
