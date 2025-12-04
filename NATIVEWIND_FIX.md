# 🔧 Correção NativeWind - Guia de Instalação

## Problemas Identificados

1. ❌ `tailwindcss` não estava instalado no package.json
2. ❌ `metro.config.js` apontava para caminho errado do CSS (`./app/global.css` → `./src/app/global.css`)

## Correções Aplicadas

### 1. Adicionado tailwindcss ao package.json
```json
"devDependencies": {
  "tailwindcss": "^3.4.1"
}
```

### 2. Corrigido metro.config.js
```javascript
module.exports = withNativeWind(config, { input: './src/app/global.css' })
```

## 🚀 Passos para Aplicar

### 1. Instalar Dependências
```bash
npm install
```

ou se preferir yarn:
```bash
yarn install
```

### 2. Limpar Cache
```bash
npm start -- --clear
```

ou
```bash
npx expo start -c
```

### 3. Reiniciar o Servidor
- Pressione `Ctrl+C` para parar
- Execute `npm start` novamente

## ✅ Verificação

Após seguir os passos acima, as classes do Tailwind devem funcionar corretamente:

### Teste Rápido
Abra qualquer arquivo e verifique se as classes estão sendo aplicadas:
```tsx
<View className="flex-1 bg-blue-600">
  <Text className="text-white font-bold">Teste</Text>
</View>
```

## 📋 Checklist de Configuração

- ✅ `tailwindcss` instalado no package.json
- ✅ `nativewind` instalado (já estava)
- ✅ `tailwind.config.js` configurado corretamente
- ✅ `metro.config.js` com caminho correto
- ✅ `babel.config.js` com presets do nativewind
- ✅ `global.css` importado no _layout.tsx
- ✅ Content paths incluindo todas as pastas

## 🎨 Cores Customizadas

Se quiser adicionar suas cores da paleta ao Tailwind, atualize o `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b4f76',
      'primary-dark': '#2f3b52',
      'primary-darker': '#1e283c',
      success: '#10b981',
      border: '#9ca3af',
      secondary: '#7f8794',
    },
  },
},
```

Uso:
```tsx
<View className="bg-primary">
  <Text className="text-success">Texto Verde</Text>
</View>
```

## 🐛 Troubleshooting

### Problema: Classes não aplicando
**Solução**: Limpar cache
```bash
npm start -- --clear
rm -rf node_modules/.cache
```

### Problema: Estilos inline funcionam, className não
**Solução**: Verificar se global.css está importado no _layout.tsx
```tsx
import "./global.css";
```

### Problema: Cores não aparecem
**Solução**: Usar style inline para cores customizadas
```tsx
<View style={{ backgroundColor: '#3b4f76' }}>
```

Ou adicionar no tailwind.config.js como mostrado acima.

## 📱 Testando as Telas

Após aplicar as correções, teste as telas:

1. Welcome Screen - Deve ter background escuro
2. Home Screen - Cards devem ter fundo azul médio
3. Profile Screen - Deve seguir o tema dark

Se ainda houver problemas, pode ser necessário usar `style` inline para cores específicas da paleta.
