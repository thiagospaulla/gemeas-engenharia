-- =====================================================
-- SQL FINAL PARA EXECUTAR NO NEON
-- Execute todos estes comandos em ordem
-- =====================================================

-- 1️⃣ ADICIONAR CAMPO CNPJ NA TABELA USERS
ALTER TABLE users ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18);

-- 2️⃣ ADICIONAR CAMPO COMPLEMENT (COMPLEMENTO DE ENDEREÇO)
ALTER TABLE users ADD COLUMN IF NOT EXISTS complement TEXT;

-- 3️⃣ CRIAR ÍNDICE ÚNICO PARA CNPJ (permite NULL)
DROP INDEX IF EXISTS users_cnpj_key;
CREATE UNIQUE INDEX users_cnpj_key ON users(cnpj) WHERE cnpj IS NOT NULL;

-- ✅ VERIFICAR SE OS CAMPOS FORAM CRIADOS
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('cnpj', 'complement', 'active')
ORDER BY column_name;

-- 📊 VERIFICAR ESTRUTURA COMPLETA DA TABELA USERS
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ✅ RESULTADO ESPERADO:
-- Deve mostrar as colunas:
-- - cnpj (varchar, 18, YES)
-- - complement (text, null, YES)
-- - active (boolean, false, YES)
