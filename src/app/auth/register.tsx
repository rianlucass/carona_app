import { API_ENDPOINTS } from "@/src/config/api";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock, Mail, User } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Modal, Portal, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Register() {
    const router = useRouter();
    const scrollRef = useRef<KeyboardAwareScrollView>(null);
    
    // Refs para animação de shake
    const shakeAnims = {
        name: useRef(new Animated.Value(0)).current,
        username: useRef(new Animated.Value(0)).current,
        email: useRef(new Animated.Value(0)).current,
        password: useRef(new Animated.Value(0)).current,
        confirmPassword: useRef(new Animated.Value(0)).current,
    };

    // Estados do formulário
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    

    // Estados de erro
    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Estados de sucesso (campo válido)
    const [validFields, setValidFields] = useState({
        name: false,
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");

    // Função de shake
    const shakeField = (field: keyof typeof shakeAnims) => {
        Animated.sequence([
            Animated.timing(shakeAnims[field], { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnims[field], { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnims[field], { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnims[field], { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Validações em tempo real
    const validateField = (field: string, value: string) => {
        let error = "";
        let isValid = false;

        switch (field) {
            case "name":
                if (!value.trim()) {
                    error = "Nome é obrigatório";
                } else if (value.trim().length < 3) {
                    error = "Nome deve ter no mínimo 3 caracteres";
                } else {
                    isValid = true;
                }
                break;

            case "username":
                if (!value.trim()) {
                    error = "Username é obrigatório";
                } else if (value.length < 3) {
                    error = "Username deve ter no mínimo 3 caracteres";
                } else if (!/^[a-z0-9_]+$/.test(value)) {
                    error = "Apenas letras minúsculas, números e _";
                } else {
                    isValid = true;
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email é obrigatório";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Email inválido";
                } else {
                    isValid = true;
                }
                break;

            case "password":
                if (!value) {
                    error = "Senha é obrigatória";
                } else if (value.length < 8) {
                    error = "Senha deve ter no mínimo 8 caracteres";
                } else {
                    isValid = true;
                }
                break;

            case "confirmPassword":
                if (!value) {
                    error = "Confirmação de senha é obrigatória";
                } else if (value !== formData.password) {
                    error = "As senhas não coincidem";
                } else {
                    isValid = true;
                }
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        setValidFields(prev => ({ ...prev, [field]: isValid }));
        
        return { error, isValid };
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Validação em tempo real (com debounce mental - apenas quando perde foco seria melhor)
        if (value.length > 0) {
            validateField(field, value);
        } else {
            setErrors(prev => ({ ...prev, [field]: "" }));
            setValidFields(prev => ({ ...prev, [field]: false }));
        }
    };

    // Validação completa e submit
    const handleRegister = async () => {
        // Validar todos os campos
        const validations = {
            name: validateField("name", formData.name),
            username: validateField("username", formData.username),
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
            confirmPassword: validateField("confirmPassword", formData.confirmPassword),
        };

        // Encontrar primeiro campo com erro
        const firstError = Object.entries(validations).find(([_, v]) => v.error);
        
        if (firstError) {
            const [fieldName, validation] = firstError;
            
            // Shake no campo com erro
            shakeField(fieldName as keyof typeof shakeAnims);
            
            // Mostrar modal de erro
            setErrorModalMessage(validation.error);
            setErrorModalVisible(true);
            
            return;
        }

        // Se passou na validação, envia para API
        setIsLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    username: formData.username,
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

            if (data.success || response.status === 201) {
                // Sucesso - redireciona para verificação de email (replace para bloquear voltar)
                setIsLoading(false);
                router.replace({
                    pathname: "/auth/verify-email",
                    params: { email: formData.email }
                });
            } else if (response.status === 409) {
                // Conflito: Email, username ou telefone já cadastrado
                setIsLoading(false);
                let errorMsg = data.message;
                
                // Personalizar mensagem baseada no errorCode
                if (data.errorCode === "USER_001") {
                    errorMsg = "Este email já está cadastrado. Faça login ou use outro email.";
                } else if (data.errorCode === "USER_002") {
                    errorMsg = "Este nome de usuário já existe. Escolha outro.";
                } else if (data.errorCode === "USER_003") {
                    errorMsg = "Este telefone já está cadastrado.";
                }
                
                setErrorModalMessage(errorMsg);
                setErrorModalVisible(true);
            } else if (response.status === 400) {
                // Bad Request: Validação ou formato inválido
                setIsLoading(false);
                
                if (data.errorCode === "VALIDATION_ERROR" && data.errors) {
                    // Mostra o primeiro erro de validação
                    const firstError = Object.entries(data.errors)[0];
                    if (firstError) {
                        const [field, message] = firstError;
                        setErrorModalMessage(`${field}: ${message}`);
                    } else {
                        setErrorModalMessage(data.message);
                    }
                } else if (data.errorCode === "VALIDATION_001") {
                    setErrorModalMessage("Formato de data inválido. Use DD/MM/AAAA.");
                } else {
                    setErrorModalMessage(data.message || "Dados inválidos. Verifique os campos.");
                }
                
                setErrorModalVisible(true);
            } else {
                // Outros erros
                setIsLoading(false);
                setErrorModalMessage(data.message || "Erro ao criar conta. Tente novamente.");
                setErrorModalVisible(true);
            }
        } catch (error) {
            setIsLoading(false);
            setErrorModalMessage("Erro de conexão. Verifique sua internet e tente novamente.");
            setErrorModalVisible(true);
            console.error("Erro ao cadastrar:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />
            {/* HEADER */}
            <View className="px-6 pt-4 pb-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-900"
                >
                    <ArrowLeft size={22} color="#fff" />
                </TouchableOpacity>

                <Text className="text-white text-4xl font-bold mt-6 mb-2">
                    Criar conta
                </Text>
                <Text className="text-gray-400 text-base">
                    Preencha os dados para começar
                </Text>
            </View>

            {/* FORM */}
            <KeyboardAwareScrollView
                ref={scrollRef}
                enableOnAndroid
                extraScrollHeight={30}
                extraHeight={120}
                keyboardOpeningTime={0}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                className="bg-white rounded-t-[32px] px-6 pt-12"
            >

                {/* NOME */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.name }] }} className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2 text-sm">
                        Nome completo *
                    </Text>

                    <TextInput
                        mode="outlined"
                        placeholder="Seu nome completo"
                        placeholderTextColor="#9ca3af"
                        value={formData.name}
                        onChangeText={(text) => updateField("name", text)}
                        onBlur={() => validateField("name", formData.name)}
                        error={!!errors.name}
                        left={<TextInput.Icon icon={() => <User size={20} color="#9ca3af" />} />}
                        right={validFields.name ? <TextInput.Icon icon={() => <CheckCircle2 size={20} color="#10b981" />} /> : null}
                        outlineColor={errors.name ? "#ef4444" : "#e5e7eb"}
                        activeOutlineColor={errors.name ? "#ef4444" : validFields.name ? "#10b981" : "#3b4f76"}
                        textColor="#000"
                        style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.name ? (
                        <View className="flex-row items-center mt-1">
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs ml-1">{errors.name}</Text>
                        </View>
                    ) : null}
                </Animated.View>

                {/* USERNAME */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.username }] }} className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2 text-sm">
                        Nome de usuário *
                    </Text>

                    <TextInput
                        mode="outlined"
                        placeholder="Seu nome de usuário"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        value={formData.username}
                        onChangeText={(text) => updateField("username", text.toLowerCase())}
                        onBlur={() => validateField("username", formData.username)}
                        error={!!errors.username}
                        left={<TextInput.Icon icon={() => <User size={20} color="#9ca3af" />} />}
                        right={validFields.username ? <TextInput.Icon icon={() => <CheckCircle2 size={20} color="#10b981" />} /> : null}
                        outlineColor={errors.username ? "#ef4444" : "#e5e7eb"}
                        activeOutlineColor={errors.username ? "#ef4444" : validFields.username ? "#10b981" : "#3b4f76"}
                        textColor="#000"
                        style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.username ? (
                        <View className="flex-row items-center mt-1">
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs ml-1">{errors.username}</Text>
                        </View>
                    ) : null}
                </Animated.View>

                {/* EMAIL */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.email }] }} className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2 text-sm">
                        Email *
                    </Text>

                    <TextInput
                        mode="outlined"
                        placeholder="usuario@email.com"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(text) => updateField("email", text.toLowerCase())}
                        onBlur={() => validateField("email", formData.email)}
                        error={!!errors.email}
                        left={<TextInput.Icon icon={() => <Mail size={20} color="#9ca3af" />} />}
                        right={validFields.email ? <TextInput.Icon icon={() => <CheckCircle2 size={20} color="#10b981" />} /> : null}
                        outlineColor={errors.email ? "#ef4444" : "#e5e7eb"}
                        activeOutlineColor={errors.email ? "#ef4444" : validFields.email ? "#10b981" : "#3b4f76"}
                        textColor="#000"
                        style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.email ? (
                        <View className="flex-row items-center mt-1">
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs ml-1">{errors.email}</Text>
                        </View>
                    ) : null}
                </Animated.View>

                {/* SENHA */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.password }] }} className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2 text-sm">Senha *</Text>

                    <TextInput
                        mode="outlined"
                        placeholder="Mínimo 8 caracteres"
                        placeholderTextColor="#9ca3af"
                        value={formData.password}
                        onChangeText={(text) => updateField("password", text)}
                        onBlur={() => validateField("password", formData.password)}
                        error={!!errors.password}
                        secureTextEntry={!showPassword}
                        left={<TextInput.Icon icon={() => <Lock size={20} color="#9ca3af" />} />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                                color="#9ca3af"
                            />
                        }
                        outlineColor={errors.password ? "#ef4444" : "#e5e7eb"}
                        activeOutlineColor={errors.password ? "#ef4444" : validFields.password ? "#10b981" : "#3b4f76"}
                        textColor="#000"
                        style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.password ? (
                        <View className="flex-row items-center mt-1">
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs ml-1">{errors.password}</Text>
                        </View>
                    ) : null}
                </Animated.View>

                {/* CONFIRMAR SENHA */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.confirmPassword }] }} className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2 text-sm">Confirmar senha *</Text>

                    <TextInput
                        mode="outlined"
                        placeholder="Digite novamente"
                        placeholderTextColor="#9ca3af"
                        onBlur={() => validateField("confirmPassword", formData.confirmPassword)}
                        error={!!errors.confirmPassword}
                        value={formData.confirmPassword}
                        onChangeText={(text) => updateField("confirmPassword", text)}
                        secureTextEntry={!showConfirmPassword}
                        left={<TextInput.Icon icon={() => <Lock size={20} color="#9ca3af" />} />}
                        right={
                            <TextInput.Icon
                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                color="#9ca3af"
                            />
                        }
                        outlineColor={errors.confirmPassword ? "#ef4444" : "#e5e7eb"}
                        activeOutlineColor={errors.confirmPassword ? "#ef4444" : validFields.confirmPassword ? "#10b981" : "#3b4f76"}
                        textColor="#000"
                        style={{ backgroundColor: "#f9fafb" }}
                    />
                    {errors.confirmPassword ? (
                        <View className="flex-row items-center mt-1">
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs ml-1">{errors.confirmPassword}</Text>
                        </View>
                    ) : null}
                </Animated.View>

                {/* BOTÃO */}
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={isLoading}
                    disabled={isLoading}
                    buttonColor="#10b981"
                    textColor="#fff"
                    style={{
                        paddingVertical: 8,
                        marginBottom: 20,
                    }}
                    labelStyle={{ fontSize: 16, fontWeight: "600" }}
                >
                    Criar conta
                </Button>

                <Text className="text-center text-gray-600 mt-4 mb-16">
                    Já tem uma conta?{" "}
                    <Link
                        href="/welcome/welcome"
                        style={{ color: "#3b4f76", fontWeight: "700" }}
                    >
                        Entrar
                    </Link>
                </Text>

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
