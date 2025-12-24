import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { API_ENDPOINTS } from "../../config/api";
import { GOOGLE_AUTH_CONFIG } from "../../config/google-auth";

// Componente do logo do Google
const GoogleLogo = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

export default function Welcome() {
  const router = useRouter();
  const [titleText, setTitleText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const fullTitle = "Bem-vindo ao\nViaCarona";
  const fullSubtitle = "Conectando cidades e aproximando pessoas.";

  // Configurar Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_AUTH_CONFIG.webClientId,
      offlineAccess: false,
      forceCodeForRefreshToken: true,
    });
  }, []);

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

useEffect(() => {
  let titleIndex = 0;
  let subtitleIndex = 0;

  let subtitleInterval: NodeJS.Timeout | undefined;

  const titleInterval = setInterval(() => {
    if (titleIndex < fullTitle.length) {
      setTitleText(fullTitle.slice(0, titleIndex + 1));
      titleIndex++;
    } else {
      clearInterval(titleInterval);

      subtitleInterval = setInterval(() => {
        if (subtitleIndex < fullSubtitle.length) {
          setSubtitleText(fullSubtitle.slice(0, subtitleIndex + 1));
          subtitleIndex++;
        } else {
          clearInterval(subtitleInterval);
        }
      }, 30);
    }
  }, 50);

  return () => {
    clearInterval(titleInterval);
    clearInterval(subtitleInterval);
  };
}, []);


  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      {/* Conteúdo central com mais espaço */}
      <View className="flex-1 justify-center items-center px-8 pb-8">
        {/* Mensagem principal - maior com animação */}
        <Text className="text-white text-5xl font-bold mb-6 text-center leading-tight">
          {titleText.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {index > 0 && "\n"}
              {line.includes("ViaCarona") ? (
                <>
                  {line.split("ViaCarona")[0]}
                  <Text className="text-[#10b981]">Via</Text>
                  <Text className="text-white">Carona</Text>
                </>
              ) : (
                line
              )}
            </React.Fragment>
          ))}
          <Text className="text-[#10b981]">|</Text>
        </Text>

        {/* Subtexto - maior e centralizado com animação */}
        <Text className="text-gray-400 text-xl text-center leading-7 px-4">
          {subtitleText.split(" ").map((word, index) => {
            if (word === "cidades" || word === "pessoas.") {
              return (
                <Text key={index} className="text-[#10b981] font-semibold">
                  {word}{" "}
                </Text>
              );
            }
            return word + " ";
          })}
        </Text>
      </View>

      {/* Bottom Sheet - mais alto */}
      <View className="bg-white rounded-t-[32px] px-10 py-10 pb-24 shadow-2xl">
        {/* Google button com logo real */}
        <Button
          mode="outlined"
          icon={() => <GoogleLogo />}
          onPress={handleGoogleSignIn}
          loading={isLoading}
          disabled={isLoading}
          textColor="#1e283c"
          style={{
            borderColor: "#d1d5db",
            borderWidth: 1,
            marginBottom: 14,
            paddingVertical: 5,
          }}
          labelStyle={{ fontSize: 14, fontWeight: "500" }}
        >
          Continue com Google
        </Button>

        {/* Email button */}
        <Button
          mode="contained"
          icon={() => <Mail size={22} color="#fff" />}
          buttonColor="#3b4f76"
          textColor="#fff"
          onPress={() => router.push("/auth/login")}
          style={{
            marginBottom: 16,
            paddingVertical: 5,
          }}
          labelStyle={{ fontSize: 14, fontWeight: "500" }}
        >
          Continue com Email
        </Button>

        {/* Footer link */}
        <Text className="text-center text-[#7f8794] text-base">
          Ainda não tem uma conta?{" "}
          <Link
            href="/auth/register"
            style={{ color: "#3b4f76", fontWeight: "700" }}
          >
            Cadastre-se
          </Link>
        </Text>
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
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <AlertCircle size={32} color="#ef4444" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
              Ops! Algo está errado
            </Text>
            <Text style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
              {errorModalMessage}
            </Text>
            <Button
              mode="contained"
              onPress={() => setErrorModalVisible(false)}
              buttonColor="#ef4444"
              style={{ width: '100%' }}
            >
              Entendi
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
