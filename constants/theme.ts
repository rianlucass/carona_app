import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0A4FFF",      // azul
    secondary: "#02C26A",    // verde sofisticado
    background: "#F6F9FC",
    surface: "#FFFFFF",
    text: "#1A1A1A",
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0A4FFF",
    secondary: "#02C26A",
  },
};
