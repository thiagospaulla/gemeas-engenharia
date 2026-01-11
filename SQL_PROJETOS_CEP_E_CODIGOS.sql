-- =====================================================
-- SQL PARA ATUALIZAR PROJETOS COM CEP E CÓDIGOS
-- Execute no SQL Editor do Neon
-- =====================================================

-- 1️⃣ ADICIONAR CAMPO ZIPCODE (CEP) NA TABELA PROJECTS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(8);

-- 2️⃣ ADICIONAR CAMPO COMPLEMENT (COMPLEMENTO) NA TABELA PROJECTS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complement TEXT;

-- 3️⃣ ADICIONAR CAMPO PROPERTYCODES (CÓDIGOS DE IMÓVEL) NA TABELA PROJECTS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "propertyCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 4️⃣ CRIAR ÍNDICE PARA BUSCA POR CEP (performance)
CREATE INDEX IF NOT EXISTS projects_zipCode_idx ON projects("zipCode");

-- ✅ VERIFICAR SE OS CAMPOS FORAM CRIADOS
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('zipCode', 'complement', 'propertyCodes')
ORDER BY column_name;

-- 📊 VERIFICAR ESTRUTURA COMPLETA DA TABELA PROJECTS
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- ✅ RESULTADO ESPERADO:
-- Deve mostrar:
-- zipCode       | character varying | 8    | YES
-- complement    | text              | null | YES
-- propertyCodes | ARRAY             | null | YES

-- 🧪 TESTE: Inserir um projeto de teste com códigos começando com zero
-- (Execute apenas se quiser testar manualmente)
/*
INSERT INTO projects (
    id, 
    title, 
    type, 
    status, 
    progress,
    "zipCode",
    address,
    complement,
    city,
    state,
    "propertyCodes",
    "clientId",
    "createdAt",
    "updatedAt"
) VALUES (
    'test_' || encode(gen_random_bytes(10), 'hex'),
    'Projeto de Teste',
    'RESIDENCIAL',
    'ORCAMENTO',
    0,
    '01310100',
    'Avenida Paulista, 1000',
    'Casa 2, Fundos',
    'São Paulo',
    'SP',
    ARRAY['0123456789012345', '0987654321098765'],
    (SELECT id FROM users WHERE role = 'CLIENT' LIMIT 1),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
*/

-- ✅ CONCLUÍDO!
-- Próximo passo: Execute `npx prisma generate` no terminal
