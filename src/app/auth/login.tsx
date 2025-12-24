import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_ENDPOINTS } from "../../config/api";
import { GOOGLE_AUTH_CONFIG } from "../../config/google-auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // Configurar Google Sign-In
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_AUTH_CONFIG.webClientId,
      offlineAccess: false,
    });
  }, []);

  // Validação simples
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Função para login com Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const tokens = await GoogleSignin.getTokens();
      
      if (tokens.idToken) {
        await handleGoogleAuth(tokens.idToken);
      } else {
        setIsLoading(false);
        setErrorModalMessage("Erro ao obter token do Google");
        setErrorModalVisible(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        // Usuário cancelou
      } else if (error.code === 'IN_PROGRESS') {
        setErrorModalMessage("Login já em andamento");
        setErrorModalVisible(true);
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        setErrorModalMessage("Google Play Services não disponível");
        setErrorModalVisible(true);
      } else {
        setErrorModalMessage("Erro ao fazer login com Google");
        setErrorModalVisible(true);
      }
    }
  };

  // Função para enviar idToken para API
  const handleGoogleAuth = async (idToken: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.googleAuth, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        setIsLoading(false);
        setErrorModalMessage(`Erro no servidor (${response.status})`);
        setErrorModalVisible(true);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setErrorModalMessage(data.message || "Erro ao autenticar");
        setErrorModalVisible(true);
        return;
      }

      // Sucesso - verificar se o perfil está completo
      if (data && data.data && data.data.token) {
        await AsyncStorage.setItem("@auth_token", data.data.token);
        
        // Verificar se o perfil está completo
        if (data.data.profileComplete === false) {
          setIsLoading(false);
          setErrorModalMessage("Complete seu cadastro para continuar");
          setErrorModalVisible(true);
          
          setTimeout(() => {
            setErrorModalVisible(false);
            router.replace({
              pathname: "/auth/complete-profile",
              params: { 
                email: data.data?.email || "",
                name: data.data?.name || "",
                pictureUrl: data.data?.pictureUrl || ""
              }
            });
          }, 2000);
        } else {
          // Perfil completo - vai direto para home
          setIsLoading(false);
          router.replace("/home/home");
        }
      } else {
        setIsLoading(false);
        setErrorModalMessage("Resposta inesperada do servidor");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorModalMessage("Erro de conexão");
      setErrorModalVisible(true);
    }
  };

  const handleLogin = async () => {
    // Validações
    if (!email.trim() || !password.trim()) {
      setErrorModalMessage("Preencha todos os campos");
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
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
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

      // Verificar erros primeiro (status code não-ok)
      if (!response.ok) {
        setIsLoading(false);
        
        if (response.status === 401 || data.errorCode === "AUTH_002") {
          // Credenciais inválidas
          setErrorModalMessage(data.message || "Email ou senha inválidos. Tente novamente.");
          setErrorModalVisible(true);
        } else if (response.status === 403 && data.errorCode === "AUTH_001") {
          // Email não verificado - redirecionar para verificação
          setErrorModalMessage(data.message || "Email não verificado. Redirecionando...");
          setErrorModalVisible(true);
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            setErrorModalVisible(false);
            router.replace({
              pathname: "/auth/verify-email",
              params: { email: email.trim() }
            });
          }, 2000);
        } else if (response.status === 403 && data.errorCode === "USER_005") {
          // Cadastro incompleto - redirecionar para completar perfil
          setErrorModalMessage(data.message || "Cadastro incompleto. Redirecionando...");
          setErrorModalVisible(true);
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            setErrorModalVisible(false);
            router.replace({
              pathname: "/auth/complete-profile",
              params: { email: email.trim() }
            });
          }, 2000);
        } else if (response.status === 404 || data.errorCode === "USER_NOT_FOUND" || data.errorCode === "USER_404") {
          // Usuário não encontrado
          setErrorModalMessage(data.message || "Usuário não encontrado. Verifique seu email ou cadastre-se.");
          setErrorModalVisible(true);
        } else {
          // Outros erros
          setErrorModalMessage(data.message || "Erro ao fazer login. Tente novamente.");
          setErrorModalVisible(true);
        }
        return;
      }

      // Login com sucesso - salvar token
      if (data && data.data && data.data.token) {
        const token = data.data.token;
        await AsyncStorage.setItem("@auth_token", token);
        setIsLoading(false);
        // Redirecionar para home (replace para não permitir voltar)
        router.replace("/home/home");
      } else {
        // Resposta OK mas sem token
        setIsLoading(false);
        setErrorModalMessage("Resposta inesperada do servidor. Tente novamente.");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorModalMessage("Erro de conexão. Tente novamente.");
      setErrorModalVisible(true);
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
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
          >
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-4xl font-bold mt-6 mb-2">
            Bem-vindo de volta
          </Text>
          <Text className="text-gray-400 text-base">
            Faça login para continuar
          </Text>
        </View>

        {/* Formulário */}
        <View className="flex-1 bg-white rounded-t-[32px] px-6 pt-8">
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
                className="flex-1 py-4 px-3 text-base text-gray-900"
              />
            </View>
          </View>

          {/* Senha */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              Senha
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 bg-gray-50">
              <Lock size={20} color="#9ca3af" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                className="flex-1 py-4 px-3 text-base text-gray-900"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity 
            className="self-end mb-8"
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text className="text-[#3b4f76] font-semibold text-sm">
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <Button
            mode="contained"
            onPress={handleLogin}
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
            Entrar
          </Button>

          {/* Divisor */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">ou</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Botão Google */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className="flex-row items-center justify-center border-2 border-gray-300 rounded-xl py-3 mb-6 bg-white"
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={{ width: 20, height: 20, marginRight: 12 }}
            />
            <Text className="text-gray-700 font-semibold text-base">
              Continuar com Google
            </Text>
          </TouchableOpacity>

          {/* Criar conta */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">
              Não tem uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-[#3b4f76] font-bold text-sm">
                Cadastre-se
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
    </SafeAreaView>
  );
}