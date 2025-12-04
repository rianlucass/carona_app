# 🚀 Guia de Início Rápido - ViaCarona

## Começando o Desenvolvimento

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o App
```bash
npm start
```

### 3. Escolher Plataforma
- Pressione `a` para Android
- Pressione `i` para iOS  
- Pressione `w` para Web

## 🎯 Primeiros Passos

### Fluxo de Navegação Atual
1. **Tela Welcome** (`/`)
   - Botão "Entrar" → Login
   - Botão "Criar conta" → Registro

2. **Login** (`/(auth)/login`)
   - Validação de email e senha
   - Redireciona para Home após login

3. **Registro** (`/(auth)/register`)
   - Formulário completo com validações
   - Redireciona para Home após cadastro

4. **Home** (`/main/home`)
   - Lista de caronas disponíveis
   - Ações rápidas (Oferecer/Buscar)
   - Botão de perfil no header

5. **Perfil** (`/main/profile`)
   - Informações do usuário
   - Menu de opções
   - Botão de logout

## 📝 Tarefas Sugeridas

### Curto Prazo
- [ ] Implementar busca de caronas
- [ ] Tela de detalhes da carona
- [ ] Tela de criação de carona
- [ ] Sistema de filtros

### Médio Prazo
- [ ] Integração com API/Backend
- [ ] Sistema de autenticação real
- [ ] Sistema de reservas
- [ ] Implementar mapas

### Longo Prazo
- [ ] Chat entre usuários
- [ ] Avaliações e reviews
- [ ] Sistema de pagamentos
- [ ] Notificações push

## 🛠️ Desenvolvimento

### Adicionar Nova Tela
1. Criar arquivo em `/src/app/`
2. Implementar componente
3. Atualizar tipos de navegação em `/src/types/index.ts`

### Criar Novo Componente
1. Adicionar em `/src/components/` ou `/src/components/common/`
2. Usar TypeScript com tipagem
3. Aplicar NativeWind para estilos

### Adicionar Nova Feature
1. Criar pasta em `/src/features/`
2. Organizar: `screens/`, `hooks/`, `services/`
3. Manter isolamento de contexto

## 🎨 Estilização

### Usando NativeWind (Tailwind)
```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-xl font-bold text-gray-900">
    Título
  </Text>
</View>
```

### Cores Padrão
- Primária: `blue-600` (#2563eb)
- Texto: `gray-900` (#111827)
- Texto secundário: `gray-600` (#4b5563)
- Fundo: `gray-50` (#f9fafb)
- Branco: `white` (#ffffff)

## 📦 Componentes Disponíveis

### AppButton
```tsx
<AppButton 
  title="Entrar"
  variant="primary" // primary | secondary | outline
  isLoading={false}
  onPress={() => {}}
/>
```

### AppInput
```tsx
<AppInput
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

### Card
```tsx
<Card variant="elevated" onPress={() => {}}>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

## 🔧 Utilitários

### Validações
```tsx
import { isValidEmail, isValidPassword } from '@/utils/validators';

if (!isValidEmail(email)) {
  // Erro
}
```

### Formatação
```tsx
import { formatCurrency, formatDate } from '@/utils/formatters';

const preco = formatCurrency(25.50); // R$ 25,50
const data = formatDate(new Date()); // 04/12/2025
```

## 🐛 Debug

### Ver Logs
```bash
# Terminal do Expo
# Logs aparecem automaticamente
```

### Limpar Cache
```bash
npm start -- --clear
```

### Reinstalar Dependências
```bash
rm -rf node_modules
npm install
```

## 📚 Recursos Úteis

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)

## 💡 Dicas

1. Use TypeScript sempre
2. Mantenha componentes pequenos
3. Reutilize código
4. Teste em múltiplas plataformas
5. Commite frequentemente

---

**Bom desenvolvimento! 🚀**
