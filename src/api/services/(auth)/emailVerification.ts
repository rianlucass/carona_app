import { API_ENDPOINTS } from "@/src/config/api";
import type { ApiResponse, ResendCodeRequest, VerifyEmailRequest, VerifyEmailResponse } from "@/src/types";

/**
 * Serviço de verificação de email (Etapa 2)
 * POST /api/email-verification/verify
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<ApiResponse<VerifyEmailResponse>> => {
  const response = await fetch(API_ENDPOINTS.verifyEmail, {
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
 * Serviço de reenvio de código
 * POST /api/email-verification/resend-code
 */
export const resendVerificationCode = async (data: ResendCodeRequest): Promise<ApiResponse> => {
  const response = await fetch(API_ENDPOINTS.resendCode, {
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
