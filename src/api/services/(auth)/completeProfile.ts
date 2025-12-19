import { API_ENDPOINTS } from "@/src/config/api";
import type { ApiResponse, CompleteProfileResponse } from "@/src/types";

/**
 Dados para completar o perfil
 */
export interface CompleteProfileData {
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  cpf: string;
  state: string;
  city: string;
  photo?: {
    uri: string;
    type: string;
    name: string;
  };
}

export const completeProfile = async (data: CompleteProfileData): Promise<ApiResponse<CompleteProfileResponse>> => {
  const formData = new FormData();

  formData.append("phone", data.phone);
  formData.append("birthDate", data.birthDate);
  formData.append("gender", data.gender);
  formData.append("cpf", data.cpf);
  formData.append("state", data.state);
  formData.append("city", data.city);

  if (data.photo) {
    const photoFile = {
      uri: data.photo.uri,
      type: data.photo.type,
      name: data.photo.name,
    };
    formData.append("photo", photoFile as any);
  }

  const url = API_ENDPOINTS.completeProfile(data.email);


  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  });


  const contentType = response.headers.get("content-type");

  if (response.status === 403 && !contentType) {
    throw {
      success: false,
      message: "Email não verificado",
      errorCode: "AUTH_001"
    };
  }

  if (!contentType || !contentType.includes("application/json")) {
    const textResponse = await response.text();
    console.error("Resposta não-JSON:", textResponse.substring(0, 500));

    if (response.status === 403) {
      throw {
        success: false,
        message: "Acesso negado. Verifique se seu email foi confirmado.",
        errorCode: "AUTH_001"
      };
    }

    throw new Error(`Erro no servidor (${response.status}). Resposta: ${textResponse.substring(0, 200)}`);
  }

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
};
