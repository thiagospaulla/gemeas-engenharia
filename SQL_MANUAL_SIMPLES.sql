-- =====================================================
-- COMANDOS SQL PARA EXECUTAR MANUALMENTE
-- Execute estes comandos no seu PostgreSQL
-- =====================================================

-- 1️⃣ ADICIONAR CAMPO ACTIVE NA TABELA USERS
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false;
UPDATE users SET active = true WHERE role = 'ADMIN';

-- 2️⃣ CRIAR ENUMS
DO $$ BEGIN CREATE TYPE "BudgetStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO', 'EXPIRADO'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "InvoiceStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3️⃣ CRIAR TABELA BUDGETS (ORÇAMENTOS)
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

-- 4️⃣ CRIAR TABELA BUDGET_ITEMS (ITENS DO ORÇAMENTO)
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

-- 5️⃣ CRIAR TABELA INVOICES (FATURAS)
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

-- 6️⃣ CRIAR TABELA APPOINTMENTS (AGENDAMENTOS)
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

-- ✅ VERIFICAR SE TUDO FOI CRIADO
SELECT 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'budgets') as budgets_ok,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'budget_items') as budget_items_ok,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'invoices') as invoices_ok,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'appointments') as appointments_ok,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'active') as active_field_ok;

-- Se todos retornarem 1, está tudo OK! ✅
