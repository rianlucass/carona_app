# � Fluxo de Cadastro - Via Carona

## 🎯 Fluxo Implementado (3 Etapas)

```
1. REGISTRO
   POST /auth/register
   Campos: email, senha, nome, username
   ↓ Envia código por email

2. VERIFICAÇÃO EMAIL
   POST /api/email-verification/verify
   Código de 6 dígitos (expira em 1 minuto)
   ↓ Marca email como verificado

3. COMPLETAR PERFIL ⭐ NOVA ETAPA
   POST /auth/registerComplete/{email}
   Campos: CPF, Estado (UF), Cidade, Foto (opcional),telefone, data nascimento, gênero
   ↓ Retorna token JWT e loga automaticamente

4. DASHBOARD
   Usuário autenticado no app
```

---

## 📂 Arquivos Criados/Atualizados

### Serviços da API
- `src/api/services/(auth)/register.ts`
- `src/api/services/(auth)/emailVerification.ts`
- `src/api/services/(auth)/completeProfile.ts` 

### Telas
- `src/app/auth/verify-email.tsx` - Agora redireciona para `/complete-profile`
- `src/app/auth/complete-profile.tsx` 

### Configurações
- `src/config/api.ts` - Endpoint `completeProfile(email)`
- `src/types/index.ts` - Interfaces das 3 etapas
- `src/constants/errorCodes.ts` - `USER_004` = "CPF já em uso"

---

## 🧪 Como Testar

1. Iniciar API (porta 8080)
2. `npx expo start`
3. Seguir o fluxo:
   - `/auth/register` → preencher dados
   - Copiar código de 6 dígitos do console da API
   - `/auth/verify-email` → inserir código
   - `/auth/complete-profile` → preencher CPF, UF, Cidade
   - Redirecionado para `/home/home` com token

---
