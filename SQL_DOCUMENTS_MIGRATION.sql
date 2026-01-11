-- Migração para atualizar modelo de Documentos
-- Adiciona suporte para vincular documentos a múltiplas entidades

-- 1. Adicionar novas colunas ao modelo Document
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "budgetId" TEXT;
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "teamMemberId" TEXT;

-- 2. Tornar projectId opcional (remover NOT NULL se existir)
ALTER TABLE "documents" ALTER COLUMN "projectId" DROP NOT NULL;

-- 3. Adicionar foreign keys para novos relacionamentos
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "documents" ADD CONSTRAINT "documents_budgetId_fkey" 
  FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "documents" ADD CONSTRAINT "documents_teamMemberId_fkey" 
  FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "documents_userId_idx" ON "documents"("userId");
CREATE INDEX IF NOT EXISTS "documents_budgetId_idx" ON "documents"("budgetId");
CREATE INDEX IF NOT EXISTS "documents_teamMemberId_idx" ON "documents"("teamMemberId");
CREATE INDEX IF NOT EXISTS "documents_category_idx" ON "documents"("category");
CREATE INDEX IF NOT EXISTS "documents_uploadedAt_idx" ON "documents"("uploadedAt");

-- 5. Criar índice GIN para busca em tags (PostgreSQL)
CREATE INDEX IF NOT EXISTS "documents_tags_idx" ON "documents" USING GIN ("tags");

-- Observações:
-- - Documentos agora podem estar vinculados a: Projetos, Usuários, Orçamentos ou Membros da Equipe
-- - Todos os vínculos são opcionais (nullable)
-- - Um documento pode ter apenas um vínculo por vez
-- - Tags permitem organização e busca flexível
-- - updatedAt rastreia última modificação
