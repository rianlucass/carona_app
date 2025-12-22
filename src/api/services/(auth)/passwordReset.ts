import { API_ENDPOINTS } from "@/src/config/api";
import type { ApiResponse } from "@/src/types";

/**
 * Requisição para solicitar reset de senha
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Resposta da solicitação de reset de senha
 */
export interface RequestPasswordResetResponse {
  message: string;
  email: string;
}

/**
 * Requisição para resetar senha
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Resposta do reset de senha
 */
export interface ResetPasswordResponse {
  message: string;
  email: string;
}

/**
 * Serviço para solicitar reset de senha (Etapa 1)
 * POST /auth/password/request-reset
 */
export const requestPasswordReset = async (
  data: RequestPasswordResetRequest
): Promise<ApiResponse<RequestPasswordResetResponse>> => {
  const response = await fetch(API_ENDPOINTS.requestPasswordReset, {
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

/**
 * Serviço para resetar senha (Etapa 2)
 * POST /auth/password/reset
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await fetch(API_ENDPOINTS.resetPassword, {
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
