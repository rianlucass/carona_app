/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida senha (mínimo 8 caracteres)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Valida telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11;
};

/**
 * Valida se o campo está vazio
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};
