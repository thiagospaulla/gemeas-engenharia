# Configuração do Banco de Dados - Sistema Gêmeas Engenharia

## 📋 Resumo das Alterações

O sistema foi atualizado com as seguintes funcionalidades:

1. **Sistema de Aprovação de Usuários** - Campo `active` na tabela `users`
2. **Orçamentos (Budgets)** - Gestão completa de propostas
3. **Faturamento (Invoices)** - Controle financeiro de faturas
4. **Agenda (Appointments)** - Agendamento de compromissos

## 🔄 Migrações do Banco de Dados

### Passo 1: Atualizar o schema do Prisma

O arquivo `prisma/schema.prisma` já foi atualizado. Execute as migrações:

```bash
# Gerar migration
npx prisma migrate dev --name add_user_active_and_new_features

# Aplicar migration
npx prisma migrate deploy

# Atualizar o Prisma Client
npx prisma generate
```

### Passo 2: Criar Usuário Admin

Execute o script para criar o primeiro usuário administrador:

```bash
npm run create-admin
```

**Credenciais padrão:**
- Email: `admin@gemeas.com.br`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 📊 Comandos SQL Manuais (Alternativa)

Se preferir executar as alterações manualmente no banco de dados, use os comandos SQL abaixo:

### 1. Adicionar campo `active` na tabela `users`

```sql
-- Adicionar coluna active (default false para novos usuários)
ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT false;

-- Ativar todos os admins existentes
UPDATE users SET active = true WHERE role = 'ADMIN';
```

### 2. Criar enums necessários

```sql
-- Enum para status de orçamentos
CREATE TYPE "BudgetStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO', 'EXPIRADO');

-- Enum para status de faturas
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- Enum para status de agendamentos
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO');
```

### 3. Criar tabela de Orçamentos

```sql
CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status "BudgetStatus" DEFAULT 'RASCUNHO',
    "totalValue" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    notes TEXT,
    attachments TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT UNIQUE,
    CONSTRAINT budgets_clientId_fkey FOREIGN KEY ("clientId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT budgets_projectId_fkey FOREIGN KEY ("projectId") REFERENCES projects(id)
);
```

### 4. Criar tabela de Itens de Orçamento

```sql
CREATE TABLE budget_items (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    category TEXT,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT budget_items_budgetId_fkey FOREIGN KEY ("budgetId") REFERENCES budgets(id) ON DELETE CASCADE
);
```

### 5. Criar tabela de Faturas

```sql
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    "invoiceNumber" TEXT UNIQUE NOT NULL,
    description TEXT,
    amount DOUBLE PRECISION NOT NULL,
    status "InvoiceStatus" DEFAULT 'PENDENTE',
    "issueDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    notes TEXT,
    attachments TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT invoices_clientId_fkey FOREIGN KEY ("clientId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT invoices_projectId_fkey FOREIGN KEY ("projectId") REFERENCES projects(id)
);
```

### 6. Criar tabela de Agendamentos

```sql
CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status "AppointmentStatus" DEFAULT 'AGENDADO',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    location TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT appointments_clientId_fkey FOREIGN KEY ("clientId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT appointments_projectId_fkey FOREIGN KEY ("projectId") REFERENCES projects(id)
);
```

### 7. Criar usuário admin manualmente (se necessário)

```sql
-- Substitua 'HASH_DA_SENHA' pelo hash bcrypt da senha
-- Você pode gerar usando: node -e "console.log(require('bcryptjs').hashSync('admin123', 12))"

INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    active,
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid()::text, -- ou use cuid se preferir
    'Administrador',
    'admin@gemeas.com.br',
    'HASH_DA_SENHA_AQUI',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

## ✅ Verificação

Para verificar se tudo foi criado corretamente:

```sql
-- Verificar estrutura das tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar usuários admin
SELECT id, name, email, role, active 
FROM users 
WHERE role = 'ADMIN';

-- Contar registros em cada tabela
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM projects) as projects,
    (SELECT COUNT(*) FROM budgets) as budgets,
    (SELECT COUNT(*) FROM invoices) as invoices,
    (SELECT COUNT(*) FROM appointments) as appointments;
```

## 🚀 Iniciar Aplicação

Após configurar o banco de dados:

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Executar migrations
npx prisma migrate deploy

# Criar admin
npm run create-admin

# Iniciar aplicação
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## 📝 Notas Importantes

1. **Campo `active`**: Todos os novos usuários CLIENT são criados com `active = false` e precisam ser aprovados por um admin
2. **Admins**: Sempre são criados com `active = true`
3. **Notificações**: O sistema cria notificações automáticas para usuários quando:
   - Conta é aprovada
   - Usuário é promovido a admin
   - Novo orçamento é criado
   - Nova fatura é emitida
   - Agendamento é criado ou atualizado

## 🔐 Segurança

- Sempre use variáveis de ambiente para `DATABASE_URL` e `NEXTAUTH_SECRET`
- Altere as senhas padrão imediatamente
- Use HTTPS em produção
- Implemente rate limiting nas APIs
