# ⚙️ Configurações do Admin

## ✅ Funcionalidade Implementada!

O módulo de **Configurações do Administrador** foi desenvolvido com sucesso e inclui gerenciamento completo de senha e usuários!

---

## 🎯 Funcionalidades Disponíveis

### 1. 🔐 **Perfil & Senha**
- Visualizar informações do perfil do admin
- Alterar senha com validação
- Verificação de senha atual
- Confirmação de nova senha

### 2. 👥 **Gerenciar Usuários**
- Listar todos os usuários do sistema
- Visualizar usuários pendentes de aprovação
- Aprovar/ativar usuários
- Desativar usuários
- Filtrar por status (ativo/inativo)
- Badge de alerta para aprovações pendentes

### 3. ➕ **Cadastrar Usuário**
- Criar novos usuários (Admin ou Cliente)
- Definir se usuário inicia ativo
- Validações completas
- Campos: Nome, Email, Senha, Função, Telefone, CPF, CNPJ

---

## 📋 Estrutura da Página

A página `/admin/settings` é organizada em **3 abas**:

```
┌─────────────────────────────────────────────────────┐
│  Perfil & Senha │ Gerenciar Usuários │ Cadastrar    │
└─────────────────────────────────────────────────────┘

ABA 1 - Perfil & Senha:
┌──────────────────┬──────────────────┐
│ Informações      │ Alterar Senha    │
│ - Nome           │ - Senha Atual    │
│ - Email          │ - Nova Senha     │
│ - Função (Admin) │ - Confirmar      │
│                  │ [Alterar Senha]  │
└──────────────────┴──────────────────┘

ABA 2 - Gerenciar Usuários:
┌────────────────────────────────────┐
│ Aguardando Aprovação (Badge: 3)   │
│ ┌─────────────────────────────┐   │
│ │ João Silva                  │   │
│ │ joao@email.com      [Aprovar]│  │
│ └─────────────────────────────┘   │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Todos os Usuários (15)             │
│ ┌─────────────────────────────┐   │
│ │ [Avatar] Maria Santos       │   │
│ │ Admin | Ativo    [Desativar]│   │
│ │ maria@email.com │ (11) 9999 │   │
│ └─────────────────────────────┘   │
└────────────────────────────────────┘

ABA 3 - Cadastrar Usuário:
┌────────────────────────────────────┐
│ [Formulário de Cadastro]           │
│ - Nome Completo *                  │
│ - Email *       | Senha *          │
│ - Função *      | Telefone         │
│ - CPF           | CNPJ             │
│ ☑ Ativar imediatamente             │
│           [Criar Usuário]          │
└────────────────────────────────────┘
```

---

## 🔌 API Routes Criadas

### 1. **PUT /api/users/change-password**
Alterar senha do próprio usuário

**Request:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

**Response:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Validações:**
- ✅ Senha atual deve estar correta
- ✅ Nova senha mínimo 6 caracteres
- ✅ Confirmação de senha deve coincidir

---

### 2. **PUT /api/users/[id]/activate**
Aprovar/ativar ou desativar usuário

**Request:**
```json
{
  "active": true
}
```

**Response:**
```json
{
  "user": { ... },
  "message": "Usuário ativado com sucesso"
}
```

**Permissões:**
- ✅ Apenas ADMIN
- ✅ Não pode desativar a si mesmo

---

### 3. **POST /api/users/create-user**
Admin criar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "CLIENT",
  "phone": "11999999999",
  "cpf": "12345678900",
  "cnpj": "12345678000199",
  "active": true
}
```

**Response:**
```json
{
  "user": { ... },
  "message": "Usuário criado com sucesso"
}
```

**Validações:**
- ✅ Email único
- ✅ CPF único (se fornecido)
- ✅ CNPJ único (se fornecido)
- ✅ Senha mínimo 6 caracteres

---

## 🚀 Como Usar

### Para Alterar Senha:

1. **Acesse Configurações:**
   - Faça login como ADMIN
   - No menu lateral, clique em "Configurações"
   - Ou acesse `/admin/settings`

2. **Na aba "Perfil & Senha":**
   - Digite sua senha atual
   - Digite a nova senha (mínimo 6 caracteres)
   - Confirme a nova senha
   - Clique em "Alterar Senha"

3. **Confirmação:**
   - Mensagem de sucesso aparecerá
   - Formulário será limpo
   - Senha alterada imediatamente

---

### Para Aprovar Usuários:

1. **Acesse a aba "Gerenciar Usuários"**

2. **Usuários Pendentes:**
   - Verá card amarelo "Aguardando Aprovação"
   - Badge vermelha mostra quantidade pendente
   - Lista de usuários não aprovados

3. **Aprovar:**
   - Clique no botão "Aprovar" (verde)
   - Confirme a ação
   - Usuário passa para "Ativos"
   - Recebe acesso ao sistema

---

### Para Cadastrar Novo Usuário:

1. **Acesse a aba "Cadastrar Usuário"**

2. **Preencha o formulário:**
   - **Nome Completo** (obrigatório)
   - **Email** (obrigatório, único)
   - **Senha** (obrigatório, mín. 6 caracteres)
   - **Função:**
     - Cliente (acesso limitado)
     - Administrador (acesso total)
   - **Telefone** (opcional)
   - **CPF** (opcional, único)
   - **CNPJ** (opcional, único)
   - **☑ Ativar imediatamente** (opcional)

3. **Criar:**
   - Clique em "Criar Usuário"
   - Mensagem de sucesso
   - Formulário limpo
   - Usuário aparece na lista

---

### Para Desativar Usuário:

1. **Aba "Gerenciar Usuários"**

2. **Localizar usuário ativo**

3. **Clicar em "Desativar":**
   - Botão vermelho ao lado do usuário
   - Confirmar ação
   - Usuário perde acesso
   - Badge muda para "Inativo"

4. **Para reativar:**
   - Mesmo processo, botão "Ativar" (verde)

---

## 🎨 Design e Interface

### Abas Interativas
- ✅ Navegação por abas usando Radix UI
- ✅ Indicador visual da aba ativa
- ✅ Badge de notificação para aprovações pendentes
- ✅ Transições suaves

### Cards Informativos
- ✅ Perfil do admin com informações destacadas
- ✅ Formulários organizados e claros
- ✅ Cards de usuários com avatar inicial
- ✅ Badges coloridos para status

### Cores e Status
- 🟢 **Verde:** Aprovação, Ativo, Sucesso
- 🔴 **Vermelho:** Desativar, Pendente, Erro
- 🟡 **Amarelo:** Aguardando aprovação
- 🟣 **Roxo:** Administrador
- 🔵 **Azul:** Cliente
- 🟤 **Dourado (#C9A574):** Marca da empresa

### Badges
- **Admin/Cliente:** Indica função do usuário
- **Ativo/Inativo:** Status do usuário
- **Pendente:** Aguardando aprovação

---

## 🔒 Segurança

### Validações de Senha
- ✅ Senha atual deve ser verificada
- ✅ Mínimo 6 caracteres
- ✅ Confirmação obrigatória
- ✅ Hash seguro (bcrypt)

### Permissões
- ✅ Apenas ADMIN acessa configurações
- ✅ ADMIN não pode desativar a si mesmo
- ✅ Validação de token em todas as rotas
- ✅ Verificação de função (role)

### Validações de Cadastro
- ✅ Email único no sistema
- ✅ CPF único (se fornecido)
- ✅ CNPJ único (se fornecido)
- ✅ Campos obrigatórios validados
- ✅ Senha com hash seguro

---

## 📊 Estatísticas

### Contadores Automáticos
- Badge de usuários pendentes
- Total de usuários ativos
- Filtros por status

### Informações Exibidas
- Nome completo
- Email
- Telefone (se cadastrado)
- Função (Admin/Cliente)
- Status (Ativo/Inativo)
- Avatar com inicial do nome

---

## 💡 Dicas de Uso

### Para Gerenciar Usuários Eficientemente:

1. **Verifique regularmente:**
   - Badge na aba mostra aprovações pendentes
   - Aprovar usuários rapidamente

2. **Organize por status:**
   - Usuários pendentes aparecem em destaque
   - Usuários ativos listados separadamente

3. **Cadastro estratégico:**
   - Ative imediatamente se confiável
   - Deixe inativo para aprovar depois

4. **Segurança:**
   - Altere senha periodicamente
   - Use senhas fortes (mín. 6 caracteres)
   - Não compartilhe credenciais

---

## 📱 Responsividade

### Desktop (1920px+)
- ✅ Layout em 2 colunas (perfil)
- ✅ Formulários espaçosos
- ✅ Cards lado a lado

### Laptop (1366px)
- ✅ Layout otimizado
- ✅ Abas navegáveis

### Tablet (768px)
- ✅ Formulários em coluna única
- ✅ Botões adaptados

### Mobile (375px)
- ✅ Layout vertical
- ✅ Abas em menu

---

## 🐛 Mensagens de Erro

### Alterar Senha:
- ❌ "Senha atual incorreta"
- ❌ "As senhas não coincidem"
- ❌ "A nova senha deve ter pelo menos 6 caracteres"

### Criar Usuário:
- ❌ "Email já cadastrado"
- ❌ "CPF já cadastrado"
- ❌ "CNPJ já cadastrado"
- ❌ "Campos obrigatórios faltando"

### Aprovar/Desativar:
- ❌ "Usuário não encontrado"
- ❌ "Sem permissão"

---

## 📁 Arquivos Criados

### API Routes:
1. ✅ `/app/api/users/change-password/route.ts`
2. ✅ `/app/api/users/[id]/activate/route.ts`
3. ✅ `/app/api/users/create-user/route.ts`

### Páginas:
1. ✅ `/app/admin/settings/page.tsx`

### Documentação:
1. ✅ `CONFIGURACOES_ADMIN.md` (este arquivo)

---

## 🎯 Casos de Uso

### Caso 1: Novo Cliente se Cadastra
```
1. Cliente registra no sistema
2. Status inicial: Inativo (pending)
3. Admin recebe notificação (badge)
4. Admin acessa "Gerenciar Usuários"
5. Admin clica "Aprovar"
6. Cliente pode fazer login
```

### Caso 2: Admin Quer Trocar Senha
```
1. Admin acessa Configurações
2. Aba "Perfil & Senha"
3. Preenche senha atual
4. Define nova senha
5. Confirma nova senha
6. Clica "Alterar Senha"
7. Senha atualizada com sucesso
```

### Caso 3: Admin Cadastra Funcionário
```
1. Admin acessa "Cadastrar Usuário"
2. Preenche dados do funcionário
3. Seleciona função (Admin/Cliente)
4. Marca "Ativar imediatamente"
5. Clica "Criar Usuário"
6. Funcionário recebe credenciais
7. Pode fazer login imediatamente
```

### Caso 4: Desativar Usuário Inadimplente
```
1. Admin acessa "Gerenciar Usuários"
2. Localiza usuário
3. Clica "Desativar"
4. Confirma ação
5. Usuário perde acesso
6. Pode ser reativado depois
```

---

## ❓ FAQ

### Posso alterar minha própria senha?
Sim! Na aba "Perfil & Senha", preencha o formulário com sua senha atual e nova senha.

### O que acontece quando aprovo um usuário?
O usuário passa de "inativo" para "ativo" e pode fazer login no sistema.

### Posso desativar minha própria conta?
Não! O sistema impede que você desative a si mesmo para evitar perda de acesso.

### Quantos admins posso criar?
Ilimitado! Crie quantos administradores precisar na aba "Cadastrar Usuário".

### O que é "Ativar imediatamente"?
Ao marcar esta opção, o usuário criado já inicia ativo, sem precisar de aprovação.

### Como sei se há usuários pendentes?
Um badge vermelho aparece na aba "Gerenciar Usuários" com a quantidade.

---

## 🎉 Pronto para Uso!

A funcionalidade de configurações está completa e pronta para uso:

1. ✅ Alterar senha
2. ✅ Aprovar usuários
3. ✅ Cadastrar usuários
4. ✅ Desativar usuários
5. ✅ Gerenciar perfil

**Acesse:** `/admin/settings`

---

**Desenvolvido para Gêmeas Engenharia** 🏗️
*Gerenciamento completo de usuários e segurança!*
