# 🎨 Design System - ViaCarona Dark Theme

## Paleta de Cores

### Primárias
```
Azul Principal: #3b4f76
- Uso: Botões primários, header, títulos importantes
- Onde: Cabeçalhos, botões de ação secundária

Azul Escuro: #2f3b52
- Uso: Hover, estados pressionados, cards escuros
- Onde: Cards, containers, backgrounds de seções

Azul Mais Escuro: #1e283c
- Uso: Backgrounds escuros, home dark mode, cards premium
- Onde: Background principal do app
```

### Acento
```
Verde: #10b981
- Uso: Botões positivos, localização, badges
- Onde: Botões primários de ação, avatares, status ativos
```

### Neutras
```
Cinza Médio: #9ca3af
- Uso: Bordas, divisores, outlines, texto terciário
- Onde: Placeholders, textos não importantes

Cinza Escuro: #7f8794
- Uso: Texto secundário
- Onde: Subtítulos, informações complementares

Branco Base: #f5f7fa
- Uso: Background geral (para versão light, quando necessário)
```

### Feedback
```
Erro: #ef4444
Aviso: #f59e0b
```

## Componentes

### Telas Criadas

#### 1. Welcome (index.tsx)
- **Background**: #1e283c
- **Destaques**: 
  - Logo com fundo verde (#10b981)
  - Círculos concêntricos (#2f3b52 e #3b4f76)
  - Botão primário verde
  - Botão secundário com borda azul

#### 2. Home (main/home.tsx)
- **Header**: #2f3b52
- **Background**: #1e283c
- **Cards de Carona**: #2f3b52
  - Preço em verde (#10b981)
  - Avatar do motorista em verde
  - Informações em cinza (#9ca3af)
  - Divisores em #3b4f76

#### 3. Profile (main/profile.tsx)
- **Header**: #2f3b52
- **Background**: #1e283c
- **Cards de Menu**: #2f3b52
  - Ícones em círculos #3b4f76
  - Divisores sutis

#### 4. Detalhes da Carona (RideDetails.tsx)
- **Seções**:
  - Rota com marcadores coloridos (verde/azul)
  - Cards informativos (#2f3b52)
  - Badge de avaliação
  - Botão de reserva verde

#### 5. Buscar Carona (SearchRides.tsx)
- **Formulário**: Cards #2f3b52
- **Inputs**: Fundo #3b4f76
- **Filtros**: 
  - Ativos: Verde (#10b981)
  - Inativos: Borda #3b4f76

#### 6. Criar Carona (CreateRide.tsx)
- **Seções organizadas**: 
  - Rota, Data/Hora, Veículo, Preço, Preferências
- **Toggles**: Verde para ativo
- **Seleção de vagas**: Visual com círculos

## Padrões de Design

### Espaçamento
```
Padding padrão: 16px (p-4)
Padding seções: 20px (p-5)
Padding header: 24px (p-6)
Gap entre elementos: 12px (gap-3)
Border radius cards: 16px (rounded-2xl)
Border radius botões: 12-16px (rounded-xl/2xl)
```

### Tipografia
```
Título Principal: text-2xl font-bold (24px)
Título Secundário: text-xl font-bold (20px)
Texto Normal: text-base (16px)
Texto Secundário: text-sm (14px)
Texto Terciário: text-xs (12px)
```

### Hierarquia de Cores de Texto
```
1. Branco (#ffffff) - Títulos principais
2. Branco (#ffffff) - Textos importantes
3. Cinza Claro (#9ca3af) - Textos normais
4. Cinza Médio (#7f8794) - Textos secundários
```

### Componentes Customizados

#### Card
```tsx
// Dark variant
<Card variant="dark">
  <CardTitle dark>Título</CardTitle>
  <CardDescription dark>Descrição</CardDescription>
</Card>
```

#### Botões
```tsx
// Primário (Verde)
backgroundColor: '#10b981'

// Secundário (Azul)
backgroundColor: '#3b4f76'

// Outline
borderColor: '#3b4f76'
backgroundColor: 'transparent'
```

#### Inputs
```tsx
// Container
backgroundColor: '#3b4f76'
color: '#9ca3af' (placeholder)
color: '#ffffff' (text)
```

### Estados Interativos

```
Normal: backgroundColor padrão
Hover: backgroundColor com -10% de luminosidade
Pressed: backgroundColor com -20% de luminosidade
Disabled: opacity: 0.5
```

### Ícones e Emojis
- Preferência por emojis para manter consistência
- Tamanho padrão: text-2xl (24px)
- Espaçamento com texto: mr-2 ou mr-3

### Sombras
```
Elevação baixa: shadow-sm
Elevação média: shadow-md
Elevação alta: shadow-lg
```

## Boas Práticas

1. **Contraste**: Sempre garantir contraste adequado entre texto e fundo
2. **Consistência**: Usar sempre as mesmas cores para os mesmos propósitos
3. **Hierarquia**: Cores mais vibrantes para ações importantes
4. **Acessibilidade**: Verde (#10b981) para ações positivas, vermelho (#ef4444) para ações negativas
5. **Espaçamento**: Manter espaçamento consistente entre elementos

## Estrutura de Telas

### Header Padrão
- Background: #2f3b52
- Padding: pt-16 pb-6 px-6
- Botão voltar: text-white
- Título: text-2xl font-bold text-white

### Body Padrão
- Background: #1e283c
- Padding: p-6
- ScrollView para conteúdo longo

### Cards Informativos
- Background: #2f3b52
- Border radius: rounded-2xl
- Padding: p-5
- Margem inferior: mb-4

### Botões de Ação
- Verde (#10b981) para ações primárias
- Azul (#3b4f76) para ações secundárias
- Altura: py-5
- Border radius: rounded-2xl

## Telas Implementadas

✅ Welcome Screen (Dark)
✅ Home Screen (Dark)
✅ Profile Screen (Dark)
✅ Ride Details Screen (Dark)
✅ Search Rides Screen (Dark)
✅ Create Ride Screen (Dark)

## Próximas Telas Sugeridas

- [ ] Chat Screen
- [ ] Notifications Screen
- [ ] Reviews/Ratings Screen
- [ ] Payment Screen
- [ ] Trip History Screen
- [ ] Settings Screen
