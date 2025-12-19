import { completeProfile } from "@/src/api/services/(auth)/completeProfile";
import { getErrorMessage } from "@/src/constants/errorCodes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, Calendar, Camera, CheckCircle2, MapPin, Phone, Users } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaskedTextInput } from "react-native-mask-text";
import { Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Estados serão carregados dinamicamente da API do IBGE

export default function CompleteProfile() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  // Debug logs removed

  // Refs para animação de shake
  const shakeAnims = {
    phone: useRef(new Animated.Value(0)).current,
    birthDate: useRef(new Animated.Value(0)).current,
    gender: useRef(new Animated.Value(0)).current,
    cpf: useRef(new Animated.Value(0)).current,
    state: useRef(new Animated.Value(0)).current,
    city: useRef(new Animated.Value(0)).current,
  };

  // Estados do formulário
  const [formData, setFormData] = useState({
    phone: "",
    birthDate: "",
    gender: "",
    cpf: "",
    state: "",
    city: "",
  });

  // IBGE lists
  const [statesList, setStatesList] = useState<{ id: number; sigla: string; nome: string }[]>([]);
  const [citiesList, setCitiesList] = useState<{ id: number; nome: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const genderOptions = [
    { label: "Masculino", value: "M" },
    { label: "Feminino", value: "F" },
    { label: "Outro", value: "O" },
  ];

  // Estados de erro
  const [errors, setErrors] = useState({
    phone: "",
    birthDate: "",
    gender: "",
    cpf: "",
    state: "",
    city: "",
  });

  // Estados de validação
  const [validFields, setValidFields] = useState({
    phone: false,
    birthDate: false,
    gender: false,
    cpf: false,
    state: false,
    city: false,
  });

  const [photo, setPhoto] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  // Remover foto
  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Função de shake
  const shakeField = (field: keyof typeof shakeAnims) => {
    Animated.sequence([
      Animated.timing(shakeAnims[field], { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnims[field], { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnims[field], { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnims[field], { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Validar CPF
  const isValidCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, "");
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // CPF com todos os dígitos iguais

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Validações
  const validateField = (field: string, value: string) => {
    let error = "";
    let isValid = false;

    switch (field) {
      case "phone":
        const phoneDigits = value.replace(/\D/g, "");
        if (!phoneDigits) {
          error = "Telefone é obrigatório";
        } else if (phoneDigits.length !== 11) {
          error = "Telefone deve ter 11 dígitos";
        } else {
          isValid = true;
        }
        break;

      case "birthDate":
        if (!value) {
          error = "Data de nascimento é obrigatória";
        } else {
          const parts = value.split("/");
          if (parts.length !== 3) {
            error = "Data inválida";
          } else {
            const [d, m, y] = parts.map(p => parseInt(p, 10));
            const date = new Date(y, (m || 1) - 1, d || 1);
            if (isNaN(date.getTime()) || date.getFullYear() !== y || date.getMonth() !== ((m || 1) - 1) || date.getDate() !== d) {
              error = "Data inválida";
            } else {
              const today = new Date();
              if (date > today) {
                error = "Data não pode ser no futuro";
              } else {
                const ageYears = today.getFullYear() - date.getFullYear() - ((today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) ? 1 : 0);
                if (ageYears > 120) {
                  error = "Data muito antiga";
                } else {
                  isValid = true;
                }
              }
            }
          }
        }
        break;

      case "gender":
        if (!value) {
          error = "Gênero é obrigatório";
        } else if (!["M", "F", "O"].includes(value.toUpperCase())) {
          error = "Selecione M, F ou O";
        } else {
          isValid = true;
        }
        break;

      case "cpf":
        const cpfDigits = value.replace(/\D/g, "");
        if (!cpfDigits) {
          error = "CPF é obrigatório";
        } else if (cpfDigits.length !== 11) {
          error = "CPF deve ter 11 dígitos";
        } else if (!isValidCPF(cpfDigits)) {
          error = "CPF inválido";
        } else {
          isValid = true;
        }
        break;

      case "state":
        const stateUpper = value.toUpperCase();
        if (!value.trim()) {
          error = "Estado é obrigatório";
        } else if (stateUpper.length !== 2) {
          error = "Digite a sigla do estado (ex: SP)";
        } else if (statesList.length && !statesList.find(s => s.sigla === stateUpper)) {
          error = "Estado inválido";
        } else {
          isValid = true;
        }
        break;

      case "city":
        if (!value.trim()) {
          error = "Cidade é obrigatória";
        } else if (value.trim().length < 3) {
          error = "Nome da cidade muito curto";
        } else {
          isValid = true;
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    setValidFields((prev) => ({ ...prev, [field]: isValid }));

    return { error, isValid };
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value.length > 0) {
      validateField(field, value);
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setValidFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Carrega estados do IBGE na montagem
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await res.json();
        const mapped = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)).map((s: any) => ({ id: s.id, sigla: s.sigla, nome: s.nome }));
        setStatesList(mapped);
      } catch (e) {
        console.warn('Erro ao carregar estados IBGE', e);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  const fetchCitiesForState = async (stateId: number) => {
    setLoadingCities(true);
    try {
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`);
      const data = await res.json();
      const mapped = data.map((c: any) => ({ id: c.id, nome: c.nome }));
      setCitiesList(mapped);
    } catch (e) {
      console.warn('Erro ao carregar cidades IBGE', e);
      setCitiesList([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Selecionar foto
  const handlePickImage = async () => {
    // TODO: Implementar seleção de imagem com expo-image-picker
    // Instalar: npx expo install expo-image-picker
    setErrorModalMessage("Funcionalidade de foto será implementada em breve. Continue sem foto por enquanto.");
    setErrorModalVisible(true);
  };

  // Tirar foto
  const handleTakePhoto = async () => {
    // TODO: Implementar câmera com expo-image-picker
    // Instalar: npx expo install expo-image-picker
    setErrorModalMessage("Funcionalidade de câmera será implementada em breve. Continue sem foto por enquanto.");
    setErrorModalVisible(true);
  };

  // Submit
  const handleCompleteProfile = async () => {
    // Validar todos os campos
    const validations = {
      phone: validateField("phone", formData.phone),
      birthDate: validateField("birthDate", formData.birthDate),
      gender: validateField("gender", formData.gender),
      cpf: validateField("cpf", formData.cpf),
      state: validateField("state", formData.state),
      city: validateField("city", formData.city),
    };

    // Encontrar primeiro campo com erro
    const firstError = Object.entries(validations).find(([_, v]) => v.error);

    if (firstError) {
      const [fieldName, validation] = firstError;
      shakeField(fieldName as keyof typeof shakeAnims);
      setErrorModalMessage(validation.error);
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      // Limpar CPF (remover pontos e traços)
      const cpfClean = formData.cpf.replace(/\D/g, "");
      
      // Limpar telefone (remover formatação)
      const phoneClean = formData.phone.replace(/\D/g, "");
      
      // Formatar data de nascimento para formato ISO (YYYY-MM-DD)
      const [day, month, year] = formData.birthDate.split("/");
      const birthDateISO = `${year}-${month}-${day}`;

      // removed debug logs

      const response = await completeProfile({
        email: email!,
        phone: phoneClean,
        birthDate: birthDateISO,
        gender: formData.gender.toUpperCase(),
        cpf: cpfClean,
        state: formData.state.toUpperCase(),
        city: formData.city,
        photo: photo || undefined,
      });

      setIsLoading(false);

      if (response.success && response.data?.token) {
        // Salvar token
        try {
          await AsyncStorage.setItem('@auth_token', response.data.token);
        } catch (e) {
          console.warn('Não foi possível salvar token:', e);
        }

        // Mostrar modal de sucesso e redirecionar
        setSuccessModalVisible(true);
        
        setTimeout(() => {
          router.replace("/home/home");
        }, 2000);
      }
    } catch (error: any) {
      setIsLoading(false);
      
      const errorMessage = error.errorCode 
        ? getErrorMessage(error.errorCode)
        : error.message || "Erro ao completar cadastro. Tente novamente.";
      
      setErrorModalMessage(errorMessage);
      setErrorModalVisible(true);
      console.error("Erro ao completar perfil:", error);
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
          Complete seu perfil
        </Text>
        <Text className="text-gray-400 text-base">
          Última etapa! Adicione seus dados para finalizar
        </Text>
      </View>

      {/* Content */}
      <KeyboardAwareScrollView
        ref={scrollRef}
        className="flex-1 bg-white rounded-t-[32px]"
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
      >
        {/* Foto de Perfil */}
        <View className="items-center mb-8">
          <View className="relative">
            {photo ? (
              <View>
                <Image
                  source={{ uri: photo.uri }}
                  className="w-32 h-32 rounded-full"
                />
                <TouchableOpacity
                  onPress={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 items-center justify-center border-2 border-white"
                >
                  <Text className="text-white font-bold">×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center">
                <Camera size={40} color="#9ca3af" />
              </View>
            )}
            
            <TouchableOpacity
              onPress={handlePickImage}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#10b981] items-center justify-center border-4 border-white"
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 text-sm mt-3">
            Adicionar foto (opcional)
          </Text>
          
          {!photo && (
            <TouchableOpacity onPress={handleTakePhoto} className="mt-2">
              <Text className="text-[#10b981] text-sm font-semibold">
                Tirar foto agora
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TELEFONE */}
        <Animated.View style={{ transform: [{ translateX: shakeAnims.phone }] }}>
          <View className="flex-row items-center mb-1">
            <Phone size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">Telefone *</Text>
          </View>
          <MaskedTextInput
            mask="(99) 99999-9999"
            value={formData.phone}
            onChangeText={(text) => updateField("phone", text)}
            keyboardType="phone-pad"
            placeholder="(11) 99999-9999"
            style={{
              height: 56,
              borderWidth: 2,
              borderColor: errors.phone ? "#ef4444" : validFields.phone ? "#10b981" : "#e5e7eb",
              borderRadius: 16,
              paddingHorizontal: 16,
              fontSize: 16,
              marginBottom: 4,
              backgroundColor: "#f9fafb",
            }}
          />
          <View className="flex-row items-center justify-between mb-6">
            <View />
            {errors.phone && (
              <Text className="text-sm text-red-500 mr-1">{errors.phone}</Text>
            )}
            {validFields.phone && (
              <CheckCircle2 size={16} color="#10b981" />
            )}
          </View>
        </Animated.View>

        {/* DATA DE NASCIMENTO & GÊNERO */}
        <View className="flex-row gap-3 mb-6">
          {/* DATA DE NASCIMENTO */}
          <Animated.View style={{ transform: [{ translateX: shakeAnims.birthDate }], flex: 1 }}>
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-1">Nascimento *</Text>
            </View>
            <MaskedTextInput
              mask="99/99/9999"
              value={formData.birthDate}
              onChangeText={(text) => updateField("birthDate", text)}
              keyboardType="number-pad"
              placeholder="DD/MM/AAAA"
              style={{
                height: 56,
                borderWidth: 2,
                borderColor: errors.birthDate ? "#ef4444" : validFields.birthDate ? "#10b981" : "#e5e7eb",
                borderRadius: 16,
                paddingHorizontal: 16,
                fontSize: 16,
                backgroundColor: "#f9fafb",
              }}
            />
            {errors.birthDate && (
              <Text className="text-xs text-red-500 mt-1">{errors.birthDate}</Text>
            )}
          </Animated.View>

          {/* GÊNERO */}
          <Animated.View style={{ transform: [{ translateX: shakeAnims.gender }], flex: 1 }}>
            <View className="flex-row items-center mb-1">
              <Users size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-1">Gênero *</Text>
            </View>
            <TouchableOpacity
              onPress={() => setGenderModalVisible(true)}
              className="flex-row items-center justify-center bg-[#f9fafb] rounded-2xl"
              style={{
                height: 56,
                borderWidth: 2,
                borderColor: errors.gender ? "#ef4444" : validFields.gender ? "#10b981" : "#e5e7eb",
              }}
            >
              <Text className={`text-base ${formData.gender ? 'text-gray-800' : 'text-gray-400'}`}>
                {formData.gender
                  ? genderOptions.find(g => g.value === formData.gender)?.label
                  : "Selecione"}
              </Text>
            </TouchableOpacity>
            {errors.gender && (
              <Text className="text-xs text-red-500 mt-1">{errors.gender}</Text>
            )}
          </Animated.View>
        </View>

        {/* CPF */}
        <Animated.View style={{ transform: [{ translateX: shakeAnims.cpf }] }}>
          <MaskedTextInput
            mask="999.999.999-99"
            value={formData.cpf}
            onChangeText={(text) => updateField("cpf", text)}
            keyboardType="number-pad"
            placeholder="000.000.000-00"
            style={{
              height: 56,
              borderWidth: 2,
              borderColor: errors.cpf ? "#ef4444" : validFields.cpf ? "#10b981" : "#e5e7eb",
              borderRadius: 16,
              paddingHorizontal: 16,
              fontSize: 16,
              marginBottom: 4,
              backgroundColor: "#f9fafb",
            }}
          />
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-sm text-gray-600 ml-1">CPF</Text>
            {errors.cpf && (
              <Text className="text-sm text-red-500 mr-1">{errors.cpf}</Text>
            )}
            {validFields.cpf && (
              <CheckCircle2 size={16} color="#10b981" />
            )}
          </View>
        </Animated.View>

        {/* Estado (seleção via IBGE) */}
        <Animated.View style={{ transform: [{ translateX: shakeAnims.state }] }}>
          <TouchableOpacity
            onPress={() => setStateModalVisible(true)}
            className="flex-row items-center bg-[#f9fafb] border border-gray-300 rounded-lg px-4 py-4"
            style={{ marginBottom: 4 }}
          >
            <MapPin size={20} color="#9ca3af" />
            <Text className={`ml-3 text-base ${formData.state ? 'text-gray-800' : 'text-gray-400'}`}>
              {formData.state ? formData.state : 'Selecione seu estado'}
            </Text>
            <View style={{ flex: 1 }} />
            {validFields.state && (
              <CheckCircle2 size={20} color="#10b981" />
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-sm text-gray-600 ml-1">Estado (UF)</Text>
            {errors.state && (
              <Text className="text-sm text-red-500 mr-1">{errors.state}</Text>
            )}
          </View>
        </Animated.View>

        {/* Cidade (seleção via IBGE) */}
        <Animated.View style={{ transform: [{ translateX: shakeAnims.city }] }}>
          <TouchableOpacity
            onPress={() => setCityModalVisible(true)}
            className="flex-row items-center bg-[#f9fafb] border border-gray-300 rounded-lg px-4 py-4"
            style={{ marginBottom: 4 }}
          >
            <MapPin size={20} color="#9ca3af" />
            <Text className={`ml-3 text-base ${formData.city ? 'text-gray-800' : 'text-gray-400'}`}>
              {formData.city ? formData.city : 'Selecione sua cidade'}
            </Text>
            <View style={{ flex: 1 }} />
            {validFields.city && (
              <CheckCircle2 size={20} color="#10b981" />
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-sm text-gray-600 ml-1">Cidade</Text>
            {errors.city && (
              <Text className="text-sm text-red-500 mr-1">{errors.city}</Text>
            )}
          </View>
        </Animated.View>

        {/* Botão de Finalizar */}
        <Button
          mode="contained"
          onPress={handleCompleteProfile}
          loading={isLoading}
          disabled={isLoading}
          buttonColor="#10b981"
          textColor="#fff"
          style={{
            paddingVertical: 8,
            marginTop: 16,
          }}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
        >
          Finalizar cadastro
        </Button>

        <View className="h-10" />
      </KeyboardAwareScrollView>

      {/* State selector modal */}
      <Portal>
        <Modal visible={stateModalVisible} onDismiss={() => setStateModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', marginHorizontal: 20, borderRadius: 12, padding: 12, maxHeight: 420 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Selecione o estado</Text>
          {loadingStates ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={statesList}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, state: item.sigla }));
                    setStateModalVisible(false);
                    // reset city when state changes
                    setFormData(prev => ({ ...prev, city: '' }));
                    setValidFields(prev => ({ ...prev, state: true, city: false }));
                    fetchCitiesForState(item.id);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.sigla} — {item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </Modal>
      </Portal>

      {/* City selector modal */}
      <Portal>
        <Modal visible={cityModalVisible} onDismiss={() => setCityModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', marginHorizontal: 20, borderRadius: 12, padding: 12, maxHeight: 420 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Selecione a cidade</Text>
          {loadingCities ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={citiesList}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, city: item.nome }));
                    setCityModalVisible(false);
                    setValidFields(prev => ({ ...prev, city: true }));
                    validateField('city', item.nome);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </Modal>
      </Portal>

      {/* Gender selector modal */}
      <Portal>
        <Modal visible={genderModalVisible} onDismiss={() => setGenderModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', marginHorizontal: 20, borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Selecione seu gênero</Text>
          {genderOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              onPress={() => {
                setFormData(prev => ({ ...prev, gender: opt.value }));
                setGenderModalVisible(false);
                setValidFields(prev => ({ ...prev, gender: true }));
                validateField('gender', opt.value);
              }}
            >
              <Text style={{ fontSize: 16 }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>

      {/* Modal de Erro - fallback web */}
      {/** Use react-native-paper Modal on native, simple overlay on web to avoid text-node issue */}
      {Platform.OS === 'web' ? (
        errorModalVisible && (
          <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, maxWidth: 420, width: '100%' }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <AlertCircle size={32} color="#ef4444" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Ops! Algo deu errado</Text>
                <Text style={{ color: '#4b5563', textAlign: 'center', marginBottom: 16 }}>{errorModalMessage}</Text>
                <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={{ backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 12 }}>
                  <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center', paddingHorizontal: 24 }}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      ) : (
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
                Ops! Algo deu errado
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
      )}

      {/* Modal de Sucesso - fallback web */}
      {Platform.OS === 'web' ? (
        successModalVisible && (
          <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, maxWidth: 420, width: '100%' }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ecfccb', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Cadastro concluído!</Text>
                <Text style={{ color: '#4b5563', textAlign: 'center', marginBottom: 16 }}>Bem-vindo ao Via Carona! Redirecionando...</Text>
              </View>
            </View>
          </View>
        )
      ) : (
        <Portal>
          <Modal
            visible={successModalVisible}
            dismissable={false}
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
                Cadastro concluído!
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Bem-vindo ao Via Carona! Redirecionando...
              </Text>
            </View>
          </Modal>
        </Portal>
      )}
    </SafeAreaView>
  );
}
