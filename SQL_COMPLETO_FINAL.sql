-- =====================================================
-- SQL COMPLETO - TODAS AS ATUALIZAÇÕES
-- Execute TUDO de uma vez no SQL Editor do Neon
-- =====================================================

-- ==================== PARTE 1: TABELA USERS ====================

-- 1.1 Adicionar campo 'active' (controle de aprovação)
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false;

-- 1.2 Ativar todos os admins existentes
UPDATE users SET active = true WHERE role = 'ADMIN';

-- 1.3 Adicionar campo CNPJ
ALTER TABLE users ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18);

-- 1.4 Adicionar campo complement (complemento de endereço)
ALTER TABLE users ADD COLUMN IF NOT EXISTS complement TEXT;

-- 1.5 Criar índice único para CNPJ
DROP INDEX IF EXISTS users_cnpj_key;
CREATE UNIQUE INDEX users_cnpj_key ON users(cnpj) WHERE cnpj IS NOT NULL;

-- ==================== PARTE 2: TABELA PROJECTS ====================

-- 2.1 Adicionar campo zipCode (CEP)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(8);

-- 2.2 Adicionar campo complement
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complement TEXT;

-- 2.3 Adicionar campo propertyCodes (array de códigos de matrícula)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "propertyCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2.4 Criar índice para busca por CEP
CREATE INDEX IF NOT EXISTS projects_zipCode_idx ON projects("zipCode");

-- ==================== PARTE 3: CRIAR ENUMS ====================

-- 3.1 Enum para status de orçamentos
DO $$ BEGIN
    CREATE TYPE "BudgetStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO', 'EXPIRADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3.2 Enum para status de faturas
DO $$ BEGIN
    CREATE TYPE "InvoiceStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3.3 Enum para status de agendamentos
DO $$ BEGIN
    CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==================== PARTE 4: CRIAR TABELA BUDGETS ====================

CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status "BudgetStatus" DEFAULT 'RASCUNHO',
    "totalValue" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    notes TEXT,
    attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "projectId" TEXT UNIQUE REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS budgets_clientId_idx ON budgets("clientId");
CREATE INDEX IF NOT EXISTS budgets_status_idx ON budgets(status);
CREATE INDEX IF NOT EXISTS budgets_projectId_idx ON budgets("projectId");

-- ==================== PARTE 5: CRIAR TABELA BUDGET_ITEMS ====================

CREATE TABLE IF NOT EXISTS budget_items (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    category TEXT,
    "budgetId" TEXT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS budget_items_budgetId_idx ON budget_items("budgetId");

-- ==================== PARTE 6: CRIAR TABELA INVOICES ====================

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    "invoiceNumber" TEXT UNIQUE NOT NULL,
    description TEXT,
    amount DOUBLE PRECISION NOT NULL,
    status "InvoiceStatus" DEFAULT 'PENDENTE',
    "issueDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    notes TEXT,
    attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "projectId" TEXT REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS invoices_clientId_idx ON invoices("clientId");
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_dueDate_idx ON invoices("dueDate");
CREATE INDEX IF NOT EXISTS invoices_projectId_idx ON invoices("projectId");

-- ==================== PARTE 7: CRIAR TABELA APPOINTMENTS ====================

CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status "AppointmentStatus" DEFAULT 'AGENDADO',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    location TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "projectId" TEXT REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS appointments_clientId_idx ON appointments("clientId");
CREATE INDEX IF NOT EXISTS appointments_startTime_idx ON appointments("startTime");
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_projectId_idx ON appointments("projectId");

-- ==================== PARTE 8: CRIAR USUÁRIO ADMIN ====================

-- Hash bcrypt de 'admin123':
-- $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWeCrm4u

INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    active,
    "createdAt",
    "updatedAt"
) 
SELECT 
    'admin_' || encode(gen_random_bytes(12), 'hex'),
    'Administrador',
    'admin@gemeas.com.br',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWeCrm4u',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@gemeas.com.br'
);

-- ==================== PARTE 9: VERIFICAÇÕES ====================

-- 9.1 Verificar estrutura da tabela USERS
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('active', 'cnpj', 'complement')
ORDER BY column_name;

-- 9.2 Verificar estrutura da tabela PROJECTS
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('zipCode', 'complement', 'propertyCodes')
ORDER BY column_name;

-- 9.3 Verificar todas as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'projects', 'budgets', 'budget_items', 'invoices', 'appointments')
ORDER BY table_name;

-- 9.4 Verificar enums criados
SELECT typname 
FROM pg_type 
WHERE typname IN ('BudgetStatus', 'InvoiceStatus', 'AppointmentStatus')
ORDER BY typname;

-- 9.5 Verificar usuário admin
SELECT id, name, email, role, active 
FROM users 
WHERE email = 'admin@gemeas.com.br';

-- 9.6 Contar registros
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') as admins,
    (SELECT COUNT(*) FROM users WHERE active = true) as active_users,
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM budgets) as total_budgets,
    (SELECT COUNT(*) FROM invoices) as total_invoices,
    (SELECT COUNT(*) FROM appointments) as total_appointments;

-- ==================== ✅ RESULTADO ESPERADO ====================
--
-- USERS deve ter:
-- - active (boolean)
-- - cnpj (varchar)
-- - complement (text)
--
-- PROJECTS deve ter:
-- - zipCode (varchar)
-- - complement (text)
-- - propertyCodes (array)
--
-- Tabelas criadas:
-- - budgets
-- - budget_items
-- - invoices
-- - appointments
--
-- Admin criado:
-- - admin@gemeas.com.br
-- - Senha: admin123
--
-- =====================================================
-- 🎉 MIGRATION COMPLETA!
-- =====================================================
--
-- PRÓXIMOS PASSOS:
-- 1. Execute: npx prisma generate
-- 2. Inicie: npm run dev
-- 3. Acesse: http://localhost:3000
-- 4. Login: admin@gemeas.com.br / admin123
--
-- =====================================================
