import { API_ENDPOINTS } from "@/src/config/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TextInput as RNTextInput, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [timer, setTimer] = useState(60); // 1 minuto em segundos (atualizado conforme doc)
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const MAX_RESEND_ATTEMPTS = 3;
  const [resendMessage, setResendMessage] = useState("");

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timer > 0) {
      // while timer > 0 keep it counting down
      setCanResend(false);
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    } else {
      // timer === 0 -> allow resend unless attempts limit reached
      setCanResend(resendAttempts < MAX_RESEND_ATTEMPTS);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [timer, resendAttempts]);

  // Formatar timer (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Atualizar código
  const updateCode = (index: number, value: string) => {
    if (value.length > 1) return; // Apenas 1 dígito por campo
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  // Verificar código
  const handleVerify = async () => {
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setErrorModalMessage("Digite o código completo de 6 dígitos");
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.verifyEmail, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: fullCode,
        }),
      });

      // Verificar se a resposta é JSON válida
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setIsLoading(false);
        setErrorModalMessage(`Erro no servidor (${response.status}). Verifique se a API está rodando.`);
        setErrorModalVisible(true);
        console.error("Resposta não é JSON:", await response.text());
        return;
      }

      const data = await response.json();

      if (data.success || response.ok) {
        // Sucesso - redireciona para completar perfil
        setIsLoading(false);
        router.push({
          pathname: "/auth/complete-profile" as any,
          params: { email: email }
        });
      } else if (data && data.errorCode === "VERIFICATION_002") {
        // Código expirado
        setIsLoading(false);
        setErrorModalMessage("Código expirado. Clique em 'Reenviar código' para obter um novo.");
        setErrorModalVisible(true);
        setCode(["", "", "", "", "", ""]); // Limpar código
      } else if (data && data.errorCode === "VERIFICATION_001") {
        // Código inválido
        setIsLoading(false);
        setErrorModalMessage("Código inválido. Verifique e tente novamente.");
        setErrorModalVisible(true);
        setCode(["", "", "", "", "", ""]); // Limpar código
      } else {
        // Outros erros
        setIsLoading(false);
        setErrorModalMessage((data && data.message) || "Código inválido ou expirado");
        setErrorModalVisible(true);
        setCode(["", "", "", "", "", ""]); // Limpar código
      }
    } catch (error) {
      setIsLoading(false);
      setErrorModalMessage("Erro de conexão. Tente novamente.");
      setErrorModalVisible(true);
      console.error("Erro ao verificar:", error);
    }
  };

  // Reenviar código
  const handleResend = async () => {
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setResendMessage("Limite de tentativas atingido. Tente novamente mais tarde.");
      return;
    }

    setIsLoading(true);
    setCanResend(false);
    setResendMessage("");
    // start cooldown immediately
    setTimer(60);

    try {
      const response = await fetch(API_ENDPOINTS.resendCode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setIsLoading(false);
        setErrorModalMessage(`Erro no servidor (${response.status}). Verifique se a API está rodando.`);
        setErrorModalVisible(true);
        console.error("Resposta não é JSON:", await response.text());
        return;
      }

      const data = await response.json();

      if (data.success || response.ok) {
        setIsLoading(false);
        setCanResend(false);
        setCode(["", "", "", "", "", ""]); // Limpar código
        setResendAttempts((prev) => prev + 1);
        setResendMessage("Código reenviado com sucesso.");
        // limpa a mensagem depois de 4 segundos
        setTimeout(() => setResendMessage(""), 4000);
      } else if (response.status === 404) {
        setIsLoading(false);
        setErrorModalMessage("Email não encontrado. Verifique o endereço.");
        setErrorModalVisible(true);
      } else if (data.errorCode === "VERIFICATION_003") {
        setIsLoading(false);
        setErrorModalMessage("Erro ao enviar email. Tente novamente em alguns instantes.");
        setErrorModalVisible(true);
      } else {
        setIsLoading(false);
        setErrorModalMessage(data.message || "Erro ao reenviar código");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorModalMessage("Erro de conexão. Tente novamente.");
      setErrorModalVisible(true);
      console.error("Erro ao reenviar:", error);
      // permitir nova tentativa imediata se falhou por conexão
      setCanResend(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-900"
        >
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-4xl font-bold mt-6 mb-2">
          Verifique seu email
        </Text>
        <Text className="text-gray-400 text-base">
          Enviamos um código de 6 dígitos para{"\n"}
          <Text className="text-[#10b981] font-semibold">{email}</Text>
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 bg-white rounded-t-[32px] px-6 pt-12">
        {/* Ícone de Email */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-[#10b981]/10 items-center justify-center">
            <Mail size={40} color="#10b981" />
          </View>
        </View>

        {/* Timer */}
        <View className="items-center mb-8">
          <Text className="text-gray-600 text-sm mb-2">Código expira em</Text>
          <Text className="text-3xl font-bold text-gray-900">{formatTime(timer)}</Text>
        </View>

        {/* Campos de código */}
        <View className="flex-row justify-between mb-8">
          {code.map((digit, index) => (
            <View
              key={index}
              className="w-12 h-14 rounded-xl border-2 items-center justify-center"
              style={{
                borderColor: digit ? "#10b981" : "#e5e7eb",
                backgroundColor: digit ? "#10b981/5" : "#f9fafb",
              }}
            >
              <RNTextInput
                value={digit}
                onChangeText={(value) => updateCode(index, value)}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000",
                  textAlign: "center",
                  width: "100%",
                }}
              />
            </View>
          ))}
        </View>

        {/* Botão Verificar */}
        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isLoading}
          disabled={isLoading || code.join("").length !== 6}
          buttonColor="#10b981"
          textColor="#fff"
          style={{
            paddingVertical: 8,
            marginBottom: 20,
          }}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
        >
          Verificar código
        </Button>

        {/* Reenviar código */}
        <View className="items-center">
          <Text className="text-gray-600 text-sm mb-2">
            Não recebeu o código?
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || isLoading || resendAttempts >= MAX_RESEND_ATTEMPTS}
          >
            <Text
              className="font-bold text-base"
              style={{
                color: canResend ? "#3b4f76" : "#9ca3af",
              }}
            >
              {canResend ? "Reenviar código" : "Aguarde para reenviar"}
            </Text>
          </TouchableOpacity>
          {resendMessage ? (
            <Text className="text-sm mt-2" style={{ color: '#10b981' }}>{resendMessage}</Text>
          ) : null}
          {resendAttempts > 0 && (
            <Text className="text-xs text-gray-500 mt-1">Tentativas: {resendAttempts}/{MAX_RESEND_ATTEMPTS}</Text>
          )}
        </View>
      </View>

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
    </SafeAreaView>
  );
}
