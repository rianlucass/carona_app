import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// Paleta de Cores ViaCarona Dark
export const colors = {
  // Azuis
  primary: '#3b4f76',      // Botões primários, header, títulos
  primaryDark: '#2f3b52',  // Hover, estados pressionados, cards escuros
  primaryDarker: '#1e283c', // Backgrounds escuros, dark mode, cards premium
  
  // Verde
  success: '#10b981',      // Botões positivos, localização, badges
  
  // Cinzas
  border: '#9ca3af',       // Bordas, divisores, outlines
  textSecondary: '#7f8794', // Texto secundário
  
  // Backgrounds
  background: '#f5f7fa',   // Background geral
  backgroundDark: '#1e283c',
  
  // Outros
  white: '#ffffff',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.primaryDark,
    background: colors.background,
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.success,
  },
};
