-- =====================================================
-- MIGRATION MANUAL - Sistema Gêmeas Engenharia
-- Execute estes comandos no seu banco de dados PostgreSQL
-- =====================================================

-- ==================== PARTE 1: ATUALIZAR TABELA USERS ====================

-- Adicionar campo 'active' na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false;

-- Ativar todos os admins existentes
UPDATE users SET active = true WHERE role = 'ADMIN';

-- ==================== PARTE 2: CRIAR ENUMS ====================

-- Enum para status de orçamentos
DO $$ BEGIN
    CREATE TYPE "BudgetStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO', 'EXPIRADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para status de faturas
DO $$ BEGIN
    CREATE TYPE "InvoiceStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para status de agendamentos
DO $$ BEGIN
    CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==================== PARTE 3: CRIAR TABELA BUDGETS ====================

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
    "clientId" TEXT NOT NULL,
    "projectId" TEXT UNIQUE,
    CONSTRAINT budgets_clientId_fkey FOREIGN KEY ("clientId") 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT budgets_projectId_fkey FOREIGN KEY ("projectId") 
        REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS budgets_clientId_idx ON budgets("clientId");
CREATE INDEX IF NOT EXISTS budgets_status_idx ON budgets(status);
CREATE INDEX IF NOT EXISTS budgets_projectId_idx ON budgets("projectId");

-- ==================== PARTE 4: CRIAR TABELA BUDGET_ITEMS ====================

CREATE TABLE IF NOT EXISTS budget_items (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    category TEXT,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT budget_items_budgetId_fkey FOREIGN KEY ("budgetId") 
        REFERENCES budgets(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índice para melhor performance
CREATE INDEX IF NOT EXISTS budget_items_budgetId_idx ON budget_items("budgetId");

-- ==================== PARTE 5: CRIAR TABELA INVOICES ====================

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
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT invoices_clientId_fkey FOREIGN KEY ("clientId") 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT invoices_projectId_fkey FOREIGN KEY ("projectId") 
        REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS invoices_clientId_idx ON invoices("clientId");
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_dueDate_idx ON invoices("dueDate");
CREATE INDEX IF NOT EXISTS invoices_projectId_idx ON invoices("projectId");

-- ==================== PARTE 6: CRIAR TABELA APPOINTMENTS ====================

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
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT appointments_clientId_fkey FOREIGN KEY ("clientId") 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT appointments_projectId_fkey FOREIGN KEY ("projectId") 
        REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS appointments_clientId_idx ON appointments("clientId");
CREATE INDEX IF NOT EXISTS appointments_startTime_idx ON appointments("startTime");
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_projectId_idx ON appointments("projectId");

-- ==================== PARTE 7: CRIAR USUÁRIO ADMIN (OPCIONAL) ====================

-- ATENÇÃO: Execute este bloco apenas se não tiver nenhum admin criado
-- Substitua 'SEU_HASH_BCRYPT' pelo hash da senha que você gerou

/*
-- Para gerar o hash da senha, execute no terminal:
-- node -e "console.log(require('bcryptjs').hashSync('admin123', 12))"

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
    -- Gera um ID aleatório (estilo CUID)
    'admin_' || encode(gen_random_bytes(12), 'hex'),
    'Administrador',
    'admin@gemeas.com.br',
    'SEU_HASH_BCRYPT_AQUI', -- SUBSTITUA PELO HASH REAL
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@gemeas.com.br'
);
*/

-- ==================== PARTE 8: VERIFICAÇÕES ====================

-- Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'projects', 'budgets', 'budget_items', 'invoices', 'appointments', 'notifications')
ORDER BY table_name;

-- Verificar campo 'active' na tabela users
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'active';

-- Verificar enums criados
SELECT typname 
FROM pg_type 
WHERE typname IN ('BudgetStatus', 'InvoiceStatus', 'AppointmentStatus');

-- Contar registros em cada tabela
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') as total_admins,
    (SELECT COUNT(*) FROM users WHERE active = true) as active_users,
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM budgets) as total_budgets,
    (SELECT COUNT(*) FROM invoices) as total_invoices,
    (SELECT COUNT(*) FROM appointments) as total_appointments;

-- ==================== CONCLUÍDO ====================
-- Migration executada com sucesso!
-- Próximo passo: Criar usuário admin usando o comando:
-- npm run create-admin
