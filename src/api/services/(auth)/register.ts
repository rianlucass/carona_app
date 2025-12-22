import { API_ENDPOINTS } from "@/src/config/api";
import type { ApiResponse, RegisterRequest, RegisterResponse } from "@/src/types";

/**
 * Serviço de registro inicial (Etapa 1)
 * POST /auth/register
 */
export const registerUser = async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  const response = await fetch(API_ENDPOINTS.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Erro no servidor (${response.status}). Resposta não é JSON.`);
  }

  const result = await response.json();
  
  if (!response.ok) {
    throw result;
  }

  return result;
};
