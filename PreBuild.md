# Guia de Prebuild - Carona App

Este documento descreve o procedimento completo para configurar e executar o prebuild do projeto React Native com Expo e evitar dor de cabeça.

## 📋 Pré-requisitos

### 1. Android Studio
- Android Studio instalado
- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android SDK Platform-Tools
- Android SDK Command-line Tools
- NDK (Side by side) 26.1.10909125

### 2. Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas:

```powershell
# No PowerShell como Administrador
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\Rian Lucas\AppData\Local\Android\Sdk', 'Machine')
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'Machine')
```

**Após configurar, reinicie o computador!**

## 🔧 Configurações do Projeto

### 1. package.json
Versões compatíveis com Expo SDK 52:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.0.4",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/native-stack": "^6.11.0",
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "lucide-react-native": "^0.562.0",
    "nativewind": "^2.0.11",
    "react": "18.2.0",
    "react-native": "0.76.5",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "react-native-mask-text": "^0.15.0",
    "react-native-paper": "^5.12.3",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "react-native-svg": "^15.15.1",
    "react-native-svg-transformer": "^1.5.0",
    "tailwindcss": "3.3.2"
  }
}
```

### 2. app.json
Configurações essenciais:

```json
{
  "expo": {
    "name": "carona_app",
    "slug": "carona_app",
    "version": "1.0.0",
    "scheme": "caronaapp",
    "newArchEnabled": false,  // IMPORTANTE: false
    "experiments": {
      "typedRoutes": true
      // NÃO incluir reactCompiler
    }
  }
}
```

### 3. babel.config.js
Configuração para NativeWind v2:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo"
    ],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
```

### 4. tailwind.config.js
Configuração sem preset do NativeWind v4:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {  
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}", 
    "./src/features/**/*.{js,jsx,ts,tsx}"
  ],  
  theme: {    
    extend: {
      colors: {
        'primary': '#3b4f76',
        'primary-dark': '#2f3b52'
      },
    },  
  },  
  plugins: [],
}
```

### 5. tsconfig.json
Adicione baseUrl:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🚀 Procedimento de Instalação

### Passo 1: Limpar Instalação Anterior
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json, .expo -ErrorAction SilentlyContinue
```

### Passo 2: Instalar Dependências
```bash
npm install --legacy-peer-deps
```

**Avisos esperados (normais):**
- Deprecated packages do Babel
- glob, rimraf versões antigas
- react-native-vector-icons migration

### Passo 3: Executar Prebuild
```bash
npx expo prebuild --clean
```

Este comando irá:
- Gerar pastas `android/` e `ios/`
- Configurar arquivos nativos
- Criar configurações do Gradle

### Passo 4: Configurar local.properties
Após o prebuild, crie o arquivo `android/local.properties`:

```properties
sdk.dir=C\:\\Users\\Rian Lucas\\AppData\\Local\\Android\\Sdk
```

### Passo 5: Ajustar android/build.gradle
Edite `android/build.gradle`:

```gradle
buildscript {
    ext {
        buildToolsVersion = '34.0.0'
        minSdkVersion = 24
        compileSdkVersion = 34
        targetSdkVersion = 34
        kotlinVersion = '1.9.25'
        ndkVersion = "26.1.10909125"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle:8.6.0')
        classpath('com.facebook.react:react-native-gradle-plugin')
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25")
    }
}

apply plugin: "com.facebook.react.rootproject"

allprojects {
    repositories {
        maven {
            url(new File(['node', '--print', "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), '../android'))
        }
        maven {
            url(new File(['node', '--print', "require.resolve('jsc-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), '../dist'))
        }

        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
    
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core-splashscreen:1.0.1'
            force 'androidx.core:core:1.12.0'
            force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.25'
            force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.25'
        }
    }
}
```

### Passo 6: Criar Layouts de Navegação
Crie os arquivos `_layout.tsx` em cada pasta de rota:

**src/app/auth/_layout.tsx:**
```typescript
import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**src/app/main/_layout.tsx:**
```typescript
import { Stack } from "expo-router";

export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**src/app/welcome/_layout.tsx:**
```typescript
import { Stack } from "expo-router";

export default function WelcomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### Passo 7: Limpar e Executar
```bash
cd android
.\gradlew clean
cd ..
npx expo run:android
```

## 📱 Executando o App

### Opção 1: Emulador Android
1. Abra o Android Studio
2. Tools → Device Manager
3. Inicie um emulador (recomendado: Pixel 5 ou 6 com API 34)
4. Execute: `npx expo run:android`

### Opção 2: Dispositivo Físico
1. Ative "Depuração USB" no dispositivo Android
2. Conecte via USB
3. Verifique conexão: `adb devices`
4. Execute: `npx expo run:android`

### Opção 3: Expo Go (mais simples)
```bash
npx expo start
```
Escaneie o QR Code com o app Expo Go

## ⚠️ Problemas Comuns

### Erro: "SDK location not found"
**Solução:** Crie/verifique `android/local.properties`

### Erro: Kotlin version incompatible
**Solução:** Verifique se `kotlinVersion = '1.9.25'` no `build.gradle`

### Erro: "Couldn't find the prevent remove context"
**Solução:** Adicione no `src/app/_layout.tsx`:
```typescript
useEffect(() => {
  LogBox.ignoreLogs(["Couldn't find the prevent remove context"]);
}, []);
```

### Erro: Module not found (bibliotecas)
**Solução:** Instale a biblioteca faltante:
```bash
npm install <nome-da-biblioteca> --legacy-peer-deps
```

### Device offline no ADB
**Solução:**
```bash
adb kill-server
adb start-server
adb devices
```

## 🔄 Reconstruir do Zero

Se precisar reconstruir tudo:

```bash
# 1. Limpar tudo
Remove-Item -Recurse -Force node_modules, package-lock.json, android, ios, .expo

# 2. Reinstalar
npm install --legacy-peer-deps

# 3. Prebuild
npx expo prebuild --clean

# 4. Recriar local.properties
# (criar arquivo manualmente)

# 5. Ajustar build.gradle
# (editar arquivo manualmente)

# 6. Executar
npx expo run:android
```

## ✅ Checklist Final

Antes de executar o app, verifique:

- [ ] Android SDK 34 instalado
- [ ] ANDROID_HOME e JAVA_HOME configurados
- [ ] Computador reiniciado após configurar variáveis
- [ ] `node_modules` instalado sem erros
- [ ] Prebuild executado com sucesso
- [ ] `android/local.properties` criado
- [ ] `android/build.gradle` ajustado (Kotlin 1.9.25)
- [ ] Layouts de navegação criados
- [ ] Emulador rodando OU dispositivo conectado
- [ ] `adb devices` mostra dispositivo conectado

## 📝 Notas Importantes

1. **Sempre use `--legacy-peer-deps`** ao instalar pacotes npm
2. **Não use React 19** - use React 18.2.0
3. **NativeWind v2**, não v4 (v4 requer configuração diferente)
4. **Expo SDK 52** é compatível com React Native 0.76.x
5. **Reinicie o computador** após configurar variáveis de ambiente
6. **O erro "prevent remove context"** é conhecido e pode ser ignorado

## 🎯 Comandos Úteis

```bash
# Verificar dispositivos
adb devices

# Limpar cache do Metro
npx expo start --clear

# Build apenas (sem executar)
cd android && .\gradlew assembleDebug

# Desinstalar app do dispositivo
adb uninstall com.anonymous.carona_app

# Ver logs do Android
adb logcat

# Resetar ADB
adb kill-server && adb start-server
```

---

**Data de criação:** 23/12/2025  
**Versão do Expo:** SDK 52  
**Versão do React Native:** 0.76.5
