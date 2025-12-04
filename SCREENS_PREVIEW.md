# 📱 Preview das Telas - ViaCarona Dark Theme

## Telas Implementadas

### 1. 🚀 Welcome Screen (`/index.tsx`)
**Rota**: `/`

**Design**:
- Background: Azul escuro (#1e283c)
- Logo com ícone verde (#10b981)
- Círculos concêntricos azuis (#2f3b52, #3b4f76)
- Emoji central: 🗺️
- Botão verde "Entrar"
- Botão outline azul "Criar conta"

**Elementos**:
- StatusBar: light
- Logo: ViaCarona com ícone de carro
- Subtítulo: "Compartilhe viagens, economize e conecte-se"
- Descrição: "Encontre caronas próximas ou ofereça uma viagem"
- Rodapé: "Viaje com segurança e conforto"

---

### 2. 🏠 Home Screen (`/main/home.tsx`)
**Rota**: `/main/home`

**Design**:
- Header: Azul médio (#2f3b52)
- Background: Azul escuro (#1e283c)
- Search bar: Azul (#3b4f76)
- Cards de carona: Azul médio (#2f3b52)

**Elementos**:
- Saudação: "Olá, bem-vindo 👋"
- Barra de busca: "Para onde você vai?"
- Quick actions:
  - "Oferecer carona" (Verde)
  - "Buscar carona" (Azul)
- Lista de caronas disponíveis:
  - Origem → Destino
  - Preço em verde
  - Data, hora, vagas
  - Avatar e nome do motorista

---

### 3. 👤 Profile Screen (`/main/profile.tsx`)
**Rota**: `/main/profile`

**Design**:
- Header: Azul médio (#2f3b52)
- Background: Azul escuro (#1e283c)
- Cards de menu: Azul médio (#2f3b52)

**Elementos**:
- Avatar grande com letra inicial
- Nome e email
- Estatísticas:
  - Avaliação: 4.8 ⭐
  - Viagens: 12
- Menu de opções:
  - Dados pessoais
  - Minhas caronas
  - Avaliações
  - Pagamentos
  - Configurações
  - Ajuda e suporte
- Botão "Sair da conta" (vermelho)

---

### 4. 🚗 Detalhes da Carona (`/features/rides/screens/RideDetails.tsx`)
**Rota**: Componente standalone

**Design**:
- Header: Azul médio (#2f3b52)
- Seções em cards: Azul médio (#2f3b52)
- Botão de ação: Verde (#10b981)

**Elementos**:
- Rota com marcadores:
  - Origem (marcador verde)
  - Linha tracejada
  - Destino (marcador azul)
- Data e horário em grid
- Informações do motorista:
  - Avatar, nome, avaliação
  - Botão "Ver perfil"
- Veículo:
  - Emoji 🚗
  - Modelo e placa
- Vagas e preço
- Botão "Reservar vaga"

---

### 5. 🔍 Buscar Carona (`/features/rides/screens/SearchRides.tsx`)
**Rota**: Componente standalone

**Design**:
- Header: Azul médio (#2f3b52)
- Formulário: Cards azuis (#2f3b52)
- Inputs: Azul (#3b4f76)

**Elementos**:
- Formulário de busca:
  - 📍 "De onde você sai?"
  - 🎯 "Para onde você vai?"
  - 📅 "Quando?"
- Filtros:
  - Horário de saída
  - Preço máximo
  - Avaliação mínima
- Preferências (chips):
  - Somente mulheres (ativo - verde)
  - Aceita animais
  - Ar condicionado
  - Espaço para bagagem
- Botão "Buscar caronas"

---

### 6. ➕ Criar Carona (`/features/rides/screens/CreateRide.tsx`)
**Rota**: Componente standalone

**Design**:
- Header: Azul médio (#2f3b52)
- Seções organizadas em cards
- Toggles verdes para preferências

**Elementos**:
- Rota:
  - Adicionar origem
  - Adicionar destino
- Data e horário (side by side)
- Veículo:
  - Modelo atual mostrado
  - Botão "Alterar"
  - Seletor de vagas (1-4)
- Preço:
  - Input com valor
  - Sugestão de faixa
- Preferências (toggles):
  - 🎵 Pode tocar música
  - 💬 Gosto de conversar
  - 🐕 Aceita animais
- Observações (textarea)
- Botão "Publicar carona"

---

## Padrões Visuais Consistentes

### Headers
```
- Background: #2f3b52
- Padding: pt-16 pb-6 px-6
- Botão voltar: ← (text-white)
- Título: text-2xl font-bold text-white
- Subtítulo: #9ca3af
```

### Cards
```
- Background: #2f3b52
- Border radius: rounded-2xl
- Padding: p-5
- Margin bottom: mb-4
```

### Botões Primários
```
- Background: #10b981
- Text: white
- Padding: py-5
- Border radius: rounded-2xl
- Font: font-bold text-lg
```

### Botões Secundários
```
- Background: #3b4f76
- Text: white ou #9ca3af
- Padding: px-4 py-2
- Border radius: rounded-xl
```

### Inputs/Select
```
- Background: #3b4f76
- Padding: px-4 py-4
- Border radius: rounded-xl
- Placeholder: #9ca3af
```

### Textos
```
- Títulos: text-white font-bold
- Secundários: #9ca3af
- Terciários: #7f8794
```

---

## Navegação

```
index (Welcome)
  ├── /(auth)/login → /main/home
  └── /(auth)/register → /main/home
      └── /main/profile
```

**Telas Standalone** (podem ser integradas nas rotas):
- RideDetails - Detalhes de uma carona
- SearchRides - Busca avançada
- CreateRide - Criar nova carona

---

## Como Testar

1. **Iniciar o app**:
```bash
npm start
```

2. **Navegar pelas telas**:
   - Tela inicial → Botão "Entrar"
   - Home → Clique no avatar → Profile
   - Home → Cards de carona (preparados para navegação)

3. **Telas de features**:
   - Podem ser acessadas criando rotas em `/src/app/`
   - Ou importando diretamente para testes

---

## Melhorias Sugeridas

### Próximas Implementações:
1. ✅ Animações de transição
2. ✅ Pull to refresh na Home
3. ✅ Skeleton loaders
4. ✅ Bottom sheet para filtros
5. ✅ Modal de confirmação
6. ✅ Toast notifications
7. ✅ Dark mode completo
8. ✅ Tela de chat
9. ✅ Tela de notificações
10. ✅ Tela de avaliações

### Refinamentos:
- Adicionar gradientes sutis
- Sombras mais sofisticadas
- Micro-interações
- Haptic feedback
- Sound effects opcionais
