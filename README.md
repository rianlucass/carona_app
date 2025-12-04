# ViaCarona App

Aplicativo de compartilhamento de caronas desenvolvido com React Native, Expo e TypeScript.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento rápido
- **TypeScript** - Tipagem estática
- **NativeWind** - Estilização com Tailwind CSS
- **Expo Router** - Navegação baseada em arquivos
- **React Native Paper** - Componentes UI

## 📁 Estrutura do Projeto

```
carona_app/
├── src/
│   ├── app/                    # Rotas do app (Expo Router)
│   │   ├── (auth)/            # Grupo de rotas de autenticação
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── main/              # Rotas principais do app
│   │   │   ├── home.tsx
│   │   │   └── profile.tsx
│   │   ├── _layout.tsx        # Layout raiz
│   │   ├── index.tsx          # Tela de boas-vindas
│   │   └── global.css         # Estilos globais
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── common/           # Componentes comuns
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── appButton.tsx     # Botão customizado
│   │   └── appInput.tsx      # Input customizado
│   │
│   ├── features/             # Funcionalidades por contexto
│   │   ├── auth/
│   │   ├── home/
│   │   ├── profile/
│   │   └── rides/
│   │
│   ├── types/                # Definições de tipos TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                # Funções utilitárias
│   │   ├── formatters.ts    # Formatação de dados
│   │   └── validators.ts    # Validações
│   │
│   ├── services/             # Serviços e APIs
│   │
│   ├── hooks/                # Hooks customizados
│   │
│   └── constants/            # Constantes e temas
│       └── theme.ts
│
├── assets/                   # Recursos estáticos
│   └── images/
│
└── package.json
```

## 🎯 Funcionalidades

### Implementadas
- ✅ Tela de boas-vindas
- ✅ Sistema de autenticação (Login/Registro)
- ✅ Tela principal (Home) com lista de caronas
- ✅ Tela de perfil do usuário
- ✅ Componentes reutilizáveis (Button, Input, Card)
- ✅ Validações de formulários
- ✅ Navegação entre telas

### Em desenvolvimento
- 🚧 Integração com backend/API
- 🚧 Sistema de busca de caronas
- 🚧 Criação de caronas
- 🚧 Sistema de reservas
- 🚧 Chat entre usuários
- 🚧 Avaliações e reviews
- 🚧 Integração com mapas

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd carona_app
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o projeto
```bash
npm start
```

4. Execute em um dispositivo/emulador
```bash
npm run android  # Para Android
npm run ios      # Para iOS
npm run web      # Para Web
```

## 📱 Telas

### 1. Welcome (index.tsx)
Tela inicial com opções para entrar ou criar conta.

### 2. Login
Tela de autenticação com validação de email e senha.

### 3. Register
Tela de cadastro com validação completa dos campos.

### 4. Home
Tela principal exibindo caronas disponíveis e ações rápidas.

### 5. Profile
Tela de perfil do usuário com menu de configurações.

## 🎨 Componentes

### AppButton
Botão customizado com variantes (primary, secondary, outline) e suporte a loading.

### AppInput
Input customizado com label, ícones, validação e estados de foco.

### Card
Container flexível para exibição de conteúdo com variantes e suporte a ações.

### Loading
Componente de carregamento centralizado.

### EmptyState
Estado vazio para listas sem conteúdo.

## 📝 Convenções

- Use TypeScript para tipagem forte
- Componentes em PascalCase
- Arquivos em camelCase
- Use NativeWind para estilização
- Organize features por contexto
- Mantenha componentes pequenos e reutilizáveis

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Push para a branch
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
