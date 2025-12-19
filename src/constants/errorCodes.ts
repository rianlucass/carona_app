/**
 * Códigos de Erro da API - Via Carona
 * 
 * Este arquivo documenta todos os códigos de erro retornados pela API
 * para facilitar o tratamento no front-end.
 */

export const ERROR_CODES = {
  // Autenticação (AUTH_XXX)
  AUTH_001: "Email não verificado",
  AUTH_002: "Credenciais inválidas",
  AUTH_003: "Erro ao gerar token",
  AUTH_004: "Token inválido ou expirado",

  // Usuário (USER_XXX)
  USER_001: "Email já em uso",
  USER_002: "Username já em uso",
  USER_003: "Telefone já em uso",
  USER_004: "CPF já em uso",

  // Validação (VALIDATION_XXX)
  VALIDATION_001: "Formato de data inválido",
  VALIDATION_ERROR: "Erro de validação nos campos",

  // Verificação (VERIFICATION_XXX)
  VERIFICATION_001: "Código de verificação inválido",
  VERIFICATION_002: "Código de verificação expirado",
  VERIFICATION_003: "Erro ao enviar email",
} as const;

/**
 * Mensagens amigáveis para o usuário baseadas nos códigos de erro
 */
export const ERROR_MESSAGES = {
  // Autenticação
  AUTH_001: "Seu email ainda não foi verificado. Verifique sua caixa de entrada.",
  AUTH_002: "Email ou senha incorretos. Tente novamente.",
  AUTH_003: "Erro no sistema de autenticação. Tente novamente.",
  AUTH_004: "Sessão expirada. Faça login novamente.",

  // Usuário
  USER_001: "Este email já está cadastrado. Faça login ou use outro email.",
  USER_002: "Este nome de usuário já existe. Escolha outro.",
  USER_003: "Este telefone já está cadastrado.",
  USER_004: "Este CPF já está cadastrado.",

  // Validação
  VALIDATION_001: "Formato de data inválido. Use DD/MM/AAAA.",
  VALIDATION_ERROR: "Alguns campos estão incorretos. Verifique os dados.",

  // Verificação
  VERIFICATION_001: "Código inválido. Verifique e tente novamente.",
  VERIFICATION_002: "Código expirado. Clique em 'Reenviar código'.",
  VERIFICATION_003: "Erro ao enviar email. Tente novamente em alguns instantes.",
} as const;

/**
 * Status HTTP utilizados pela API
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Helper para obter mensagem amigável baseada no código de erro
 */
export const getErrorMessage = (errorCode?: string): string => {
  if (!errorCode) return "Ocorreu um erro. Tente novamente.";
  return ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] || "Ocorreu um erro. Tente novamente.";
};
