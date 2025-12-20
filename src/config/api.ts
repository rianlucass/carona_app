// Configuração da API
// A URL base é carregada do arquivo .env
// Para alterar, edite o arquivo .env na raiz do projeto
// 
// Para emulador Android: use 10.0.2.2 (mapeia para localhost da máquina host)
// Para dispositivo físico: use o IP da sua máquina na rede local (ex: 192.168.1.100)
// Para iOS Simulator: use localhost

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080";

// URLs dos endpoints
export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  verifyEmail: `${API_BASE_URL}/api/email-verification/verify`,
  resendCode: `${API_BASE_URL}/api/email-verification/resend-code`,
  completeProfile: (email: string) => `${API_BASE_URL}/auth/registerComplete/${encodeURIComponent(email)}`,
};
