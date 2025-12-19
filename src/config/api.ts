// Configuração da API
// Para emulador Android: use 10.0.2.2 (mapeia para localhost da máquina host)
// Para dispositivo físico: use o IP da sua máquina na rede local (ex: 192.168.1.100)
// Para iOS Simulator: use localhost

export const API_BASE_URL = process.env.API_BASE;

// Se estiver testando em dispositivo físico, descomente e coloque seu IP:
// export const API_BASE_URL = "http://192.168.1.XXX:8080";

// URLs dos endpoints
export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  verifyEmail: `${API_BASE_URL}/api/email-verification/verify`,
  resendCode: `${API_BASE_URL}/api/email-verification/resend-code`,
  completeProfile: (email: string) => `${API_BASE_URL}/auth/registerComplete/${encodeURIComponent(email)}`,
};
