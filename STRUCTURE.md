# Estrutura do Projeto ViaCarona

## 📂 Organização de Diretórios

### `/src/app` - Rotas e Navegação
Usa o sistema de roteamento baseado em arquivos do Expo Router.

- **`index.tsx`** - Tela de boas-vindas (Welcome Screen)
- **`_layout.tsx`** - Layout raiz com providers globais
- **`global.css`** - Estilos globais do TailwindCSS
- **`(auth)/`** - Grupo de rotas de autenticação
  - `login.tsx` - Tela de login
  - `register.tsx` - Tela de cadastro
- **`main/`** - Rotas principais do aplicativo
  - `home.tsx` - Tela inicial com lista de caronas
  - `profile.tsx` - Tela de perfil do usuário

### `/src/components` - Componentes Reutilizáveis

#### `/components/common` - Componentes UI Genéricos
- **`Card.tsx`** - Container flexível com suporte a header, content e footer
- **`Loading.tsx`** - Indicador de carregamento
- **`EmptyState.tsx`** - Estado vazio para listas

#### Componentes Base
- **`appButton.tsx`** - Botão customizado com variantes e loading
- **`appInput.tsx`** - Input com validação, ícones e estados

### `/src/features` - Funcionalidades por Domínio
Organização por feature/contexto de negócio:

- **`auth/`** - Autenticação e autorização
  - `screens/` - Telas específicas
  - `hooks/` - Hooks customizados
  - `services/` - Lógica de autenticação
  
- **`home/`** - Funcionalidades da tela inicial
  
- **`profile/`** - Perfil e configurações
  
- **`rides/`** - Funcionalidades de caronas
  - `screens/` - Lista, detalhes, criação
  - `hooks/` - useRides, useBooking
  - `services/` - API de caronas

### `/src/types` - Definições TypeScript
- **`index.ts`** - Tipos compartilhados
  - User, Ride, Booking
  - Location, Status
  - Navigation types

### `/src/utils` - Funções Utilitárias
- **`formatters.ts`** - Formatação de dados
  - formatDate, formatTime
  - formatCurrency, formatPhone
  
- **`validators.ts`** - Validações
  - isValidEmail, isValidPassword
  - isValidPhone, isEmpty

### `/src/services` - Serviços e Integrações
Camada de comunicação com APIs e serviços externos:
- `api.ts` - Cliente HTTP (axios/fetch)
- `auth.service.ts` - Serviços de autenticação
- `rides.service.ts` - Serviços de caronas
- `storage.ts` - Persistência local

### `/src/hooks` - Hooks Customizados
Hooks React reutilizáveis:
- `use-color-scheme.ts` - Tema claro/escuro
- `use-theme-color.ts` - Cores do tema
- `useAuth.ts` - Estado de autenticação (futuro)
- `useRides.ts` - Gerenciamento de caronas (futuro)

### `/src/constants` - Constantes
- **`theme.ts`** - Tema e cores do aplicativo

### `/assets` - Recursos Estáticos
- `images/` - Imagens, ícones, logos
- `fonts/` - Fontes customizadas (se houver)

## 🎯 Convenções de Nomenclatura

### Arquivos
- Componentes: `PascalCase.tsx` (ex: `AppButton.tsx`)
- Utilitários: `camelCase.ts` (ex: `formatters.ts`)
- Tipos: `camelCase.ts` ou `types.ts`
- Telas: `camelCase.tsx` (ex: `login.tsx`)

### Código
- Componentes: `PascalCase`
- Funções: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tipos/Interfaces: `PascalCase`

## 🔄 Fluxo de Navegação

```
index (Welcome)
    ├── (auth)/login
    │   └── main/home
    └── (auth)/register
        └── main/home
            └── main/profile
```

## 📦 Próximos Passos

1. **Services Layer**
   - Implementar cliente API
   - Serviços de autenticação
   - Serviços de caronas

2. **State Management**
   - Context API ou Zustand
   - Gerenciamento de usuário
   - Cache de dados

3. **Features**
   - Busca de caronas
   - Criação de caronas
   - Sistema de reservas
   - Chat entre usuários
   - Avaliações

4. **Integrations**
   - Maps API (Google Maps/Mapbox)
   - Payment gateway
   - Push notifications
   - Deep linking

## 💡 Boas Práticas

1. **Componentes**
   - Mantenha componentes pequenos e focados
   - Use composição em vez de herança
   - Extraia lógica complexa para hooks

2. **Tipagem**
   - Sempre defina tipos explícitos
   - Evite `any`
   - Use tipos compartilhados

3. **Performance**
   - Use React.memo quando necessário
   - Otimize re-renders
   - Lazy loading para telas

4. **Código**
   - DRY (Don't Repeat Yourself)
   - Comentários apenas quando necessário
   - Código auto-explicativo
