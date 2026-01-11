# 🏗️ CADASTRO DE PROJETOS COM CEP E CÓDIGOS DE IMÓVEL

## ✨ NOVAS FUNCIONALIDADES IMPLEMENTADAS

### 1. **Busca Automática de CEP** 📍
- ✅ Integração com API ViaCEP
- ✅ Busca automática ao digitar CEP completo
- ✅ Preenche: Rua, Cidade, Estado
- ✅ Formatação automática: `00000-000`
- ✅ Loading indicator durante busca
- ✅ Permite edição manual após preenchimento

### 2. **Campo Complemento** 🏠
- ✅ Para: Casa, Terreno, Lote, Bloco, etc.
- ✅ Exemplos: "Casa 2", "Lote 10", "Terreno A"
- ✅ Campo de texto livre

### 3. **Códigos de Matrícula do Imóvel** 📋
- ✅ Múltiplos códigos por projeto
- ✅ Até 16 dígitos cada
- ✅ **Aceita números começando com zero**
- ✅ Adicionar/Remover códigos dinamicamente
- ✅ Validação de formato (apenas números)
- ✅ Contador de dígitos em tempo real

---

## 🗄️ ALTERAÇÕES NO BANCO DE DADOS

### **Novos Campos na Tabela `projects`:**

| Campo | Tipo | Tamanho | Descrição |
|-------|------|---------|-----------|
| `zipCode` | VARCHAR | 8 | CEP (apenas números) |
| `complement` | TEXT | - | Complemento do endereço |
| `propertyCodes` | TEXT[] | - | Array de códigos de matrícula |

### **SQL para Executar no Neon:**

```sql
-- COPIE E COLE NO SQL EDITOR DO NEON:

ALTER TABLE projects ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complement TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "propertyCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];
CREATE INDEX IF NOT EXISTS projects_zipCode_idx ON projects("zipCode");
```

**📄 Arquivo pronto:** `SQL_PROJETOS_CEP_E_CODIGOS.sql`

---

## 📝 CAMPOS DO FORMULÁRIO

### **Localização da Obra:**

#### 1. **CEP** (com busca automática)
- Formato: `00000-000`
- Busca automática ao completar 8 dígitos
- Preenche endereço, cidade e estado

#### 2. **Endereço**
- Rua, número, bairro
- Preenchido pela API ou manual
- Exemplo: "Avenida Paulista, 1000 - Bela Vista"

#### 3. **Complemento** ⭐ NOVO
- Informações adicionais
- Exemplos:
  - "Casa 2, Fundos"
  - "Terreno Lote 10"
  - "Bloco A, Unidade 45"
  - "Galpão 3"

#### 4. **Cidade** (preenchido pela API)
- Exemplo: "São Paulo"

#### 5. **Estado/UF** (preenchido pela API)
- 2 caracteres
- Exemplo: "SP"

#### 6. **Área** (m²)
- Campo numérico
- Exemplo: "120.50"

### **Códigos de Matrícula:** ⭐ NOVO

#### Características:
- ✅ Múltiplos códigos por projeto
- ✅ Cada código: até 16 dígitos
- ✅ Aceita números começando com 0
- ✅ Exemplo: `0123456789012345`
- ✅ Botão para adicionar mais códigos
- ✅ Botão para remover códigos
- ✅ Contador: "X de 16 dígitos"

---

## 🎨 INTERFACE

### **Novo Projeto:**
```
┌─────────────────────────────────────┐
│ Localização da Obra                 │
├─────────────────────────────────────┤
│ CEP: [00000-000] 🔍                 │
│ → Busca automática ⏳               │
│                                     │
│ Endereço: [Av. Paulista, 1000]     │
│ Complemento: [Casa 2, Fundos]      │
│ Cidade: [São Paulo]                 │
│ Estado: [SP]                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Códigos de Matrícula (Opcional)     │
├─────────────────────────────────────┤
│ [0123456789012345] [X]              │
│ 16 de 16 dígitos ✅                 │
│                                     │
│ [0987654321098765] [X]              │
│ 16 de 16 dígitos ✅                 │
│                                     │
│ [+ Adicionar Outro Código]          │
│                                     │
│ 💡 Códigos do cartório (16 dígitos)│
└─────────────────────────────────────┘
```

---

## 🔍 COMO FUNCIONA

### **Busca de CEP:**

```javascript
1. Usuário digita: "01310100"
   ↓
2. Sistema formata: "01310-100"
   ↓
3. Ao completar 8 dígitos → Busca na ViaCEP
   ↓
4. API retorna:
   {
     "logradouro": "Avenida Paulista",
     "bairro": "Bela Vista",
     "localidade": "São Paulo",
     "uf": "SP"
   }
   ↓
5. Campos preenchidos automaticamente ✅
   Endereço: "Avenida Paulista"
   Cidade: "São Paulo"
   Estado: "SP"
   ↓
6. Usuário adiciona número e complemento manualmente
```

### **Códigos de Imóvel:**

```javascript
1. Campo inicial vazio: [          ]
   ↓
2. Usuário digita: "0123456789012345"
   ↓
3. Sistema valida: apenas números, max 16
   ↓
4. Mostra: "16 de 16 dígitos ✅"
   ↓
5. Usuário clica "Adicionar Outro Código"
   ↓
6. Novo campo aparece: [          ]
   ↓
7. Pode adicionar quantos precisar
   ↓
8. Ao salvar: Array ['0123456789012345', '0987654321098765']
   ↓
9. Salvo no banco preservando zeros iniciais ✅
```

---

## 📊 ESTRUTURA DE DADOS

### **No Banco de Dados:**

```sql
projects
├── zipCode: '01310100' (8 dígitos, sem hífen)
├── address: 'Avenida Paulista, 1000 - Bela Vista'
├── complement: 'Casa 2, Fundos'
├── city: 'São Paulo'
├── state: 'SP'
├── area: 120.50
└── propertyCodes: ['0123456789012345', '0987654321098765']
```

### **Na Interface:**

```
CEP: 01310-100 (formatado)
Endereço: Avenida Paulista, 1000 - Bela Vista
Complemento: Casa 2, Fundos
Cidade: São Paulo
Estado: SP
Área: 120.50 m²

Códigos de Matrícula:
Matrícula 1: 0123456789012345
Matrícula 2: 0987654321098765
```

---

## 🧪 EXEMPLOS DE USO

### **Exemplo 1: Casa Residencial**

```
Título: Casa Residencial - Maria Silva
Tipo: Residencial
Cliente: Maria Silva

Localização:
CEP: 01310-100
  → Busca automática:
    Endereço: Avenida Paulista
    Cidade: São Paulo
    Estado: SP
Complemento: Casa 2, Fundos

Códigos de Matrícula:
1. 0123456789012345 (terreno)
2. 0987654321098765 (construção)

Orçamento: R$ 350.000,00
Área: 150 m²
```

### **Exemplo 2: Prédio Comercial**

```
Título: Edifício Comercial Centro
Tipo: Comercial
Cliente: Construtora XYZ Ltda

Localização:
CEP: 04551-000
  → Busca automática:
    Endereço: Avenida Brigadeiro Faria Lima
    Cidade: São Paulo
    Estado: SP
Complemento: Lote 15, Esquina

Códigos de Matrícula:
1. 0000111122223333 (lote A)
2. 0000111122224444 (lote B)
3. 0000111122225555 (lote C)

Orçamento: R$ 2.500.000,00
Área: 850 m²
```

### **Exemplo 3: Terreno (sem construção)**

```
Título: Terreno Industrial - Lote 42
Tipo: Industrial
Cliente: João Santos

Localização:
CEP: 13035-000
Endereço: (não preenchido pela API, adicionar manualmente)
  → Rodovia dos Bandeirantes, km 95
Complemento: Lote 42, Galpão sem construção

Código de Matrícula:
1. 0012345678901234

Orçamento: R$ 800.000,00
Área: 5000 m²
```

---

## 🔧 RECURSOS TÉCNICOS

### **Validações:**
- ✅ CEP com 8 dígitos
- ✅ Códigos com até 16 dígitos
- ✅ Apenas números nos códigos
- ✅ Zeros iniciais preservados

### **Máscaras:**
- ✅ CEP: `00000-000`
- ✅ Estado: Uppercase automático (SP, RJ, MG)

### **API ViaCEP:**
- ✅ Endpoint: `https://viacep.com.br/ws/{CEP}/json/`
- ✅ Timeout: 5 segundos
- ✅ Tratamento de erros
- ✅ Fallback para preenchimento manual

---

## 🚀 PASSOS PARA IMPLEMENTAR

### **1. Executar SQL no Neon:**

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complement TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "propertyCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];
CREATE INDEX IF NOT EXISTS projects_zipCode_idx ON projects("zipCode");
```

### **2. Regenerar Prisma Client:**

```bash
cd /Users/pc/Documents/vscode/twins/gemeas-engenharia-app
npx prisma generate
```

### **3. Testar:**

```bash
npm run dev
```

Acesse: http://localhost:3000/admin/projects/new

---

## ✅ CHECKLIST DE TESTES

- [ ] Executar SQL no Neon
- [ ] Executar `npx prisma generate`
- [ ] Criar projeto com CEP
- [ ] Verificar se endereço é preenchido automaticamente
- [ ] Adicionar complemento: "Casa 1"
- [ ] Adicionar código de imóvel: `0123456789012345`
- [ ] Adicionar segundo código: `0987654321098765`
- [ ] Salvar projeto
- [ ] Verificar se códigos foram salvos corretamente
- [ ] Verificar se zeros iniciais foram preservados
- [ ] Editar projeto e atualizar códigos
- [ ] Ver projeto e confirmar que tudo aparece

---

## 📋 CAMPOS IMPLEMENTADOS

### **Páginas Atualizadas:**

#### ✅ `/admin/projects/new`
- Formulário com CEP e busca automática
- Campo complemento
- Múltiplos códigos de imóvel

#### ✅ `/admin/projects/[id]/edit`
- Mesmos campos que o "new"
- Pré-preenchido com dados existentes
- Edição de códigos existentes

#### ✅ `/admin/projects/[id]` (Visualizar - Admin)
- Exibe CEP e complemento
- Lista todos os códigos de matrícula
- Layout organizado

#### ✅ `/client/projects/[id]` (Visualizar - Cliente)
- Cliente vê CEP e complemento da obra
- Cliente vê códigos de matrícula
- Informações completas da localização

---

## 🎯 BENEFÍCIOS

### **Para o Admin:**
- ✅ Cadastro mais rápido (CEP automático)
- ✅ Dados mais completos
- ✅ Rastreabilidade (códigos de matrícula)
- ✅ Menos erros de digitação

### **Para o Cliente:**
- ✅ Ver localização completa do projeto
- ✅ Confirmar códigos de matrícula
- ✅ Transparência total

---

## 💡 EXEMPLOS DE CÓDIGOS DE MATRÍCULA

### **Formato Real Brasileiro:**

```
Código 1: 0123456789012345
          ↑ Começa com zero

Código 2: 0000123456789012
          ↑↑↑↑ Começa com zeros

Código 3: 1234567890123456
          Pode não começar com zero

Todos são aceitos e preservados! ✅
```

### **Onde Encontrar:**

- Escritura do imóvel
- Certidão de matrícula do cartório
- IPTU
- Documentação do registro de imóveis

---

## 🔄 FLUXO COMPLETO

```
1. Admin acessa /admin/projects/new
   ↓
2. Preenche título, cliente, tipo
   ↓
3. Na seção "Localização":
   - Digite CEP: 01310100
   - Sistema formata: 01310-100
   - Busca na API ViaCEP ⏳
   - Preenche endereço, cidade, estado ✅
   ↓
4. Adiciona complemento: "Casa 2"
   ↓
5. Na seção "Códigos de Matrícula":
   - Digita: 0123456789012345
   - Contador: "16 de 16 dígitos ✅"
   - Clica "Adicionar Outro Código"
   - Digita: 0987654321098765
   ↓
6. Clica "Criar Projeto"
   ↓
7. Projeto salvo com:
   - CEP sem máscara no banco
   - Complemento completo
   - Array de códigos preservando zeros
   ↓
8. Ao visualizar:
   - CEP formatado: 01310-100
   - Complemento exibido
   - Códigos listados com zeros ✅
```

---

## 🛠️ CÓDIGO SQL COMPLETO

### **Executar no Neon:**

```sql
-- 1. Adicionar CEP
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(8);

-- 2. Adicionar complemento
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complement TEXT;

-- 3. Adicionar códigos de imóvel
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "propertyCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 4. Criar índice
CREATE INDEX IF NOT EXISTS projects_zipCode_idx ON projects("zipCode");

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('zipCode', 'complement', 'propertyCodes');
```

---

## ✅ DEPOIS DE EXECUTAR O SQL

```bash
# Terminal
cd /Users/pc/Documents/vscode/twins/gemeas-engenharia-app
npx prisma generate
```

---

## 🎉 RESULTADO FINAL

Agora os projetos têm:

- ✅ Busca automática de endereço por CEP
- ✅ Campo complemento para detalhes
- ✅ Múltiplos códigos de matrícula
- ✅ Zeros iniciais preservados
- ✅ Validação em tempo real
- ✅ Interface intuitiva
- ✅ Mesmos recursos em criar/editar/visualizar

---

## 📱 ROTAS ATUALIZADAS

| Rota | Funcionalidade |
|------|----------------|
| `/admin/projects/new` | Criar projeto (com CEP e códigos) |
| `/admin/projects/[id]/edit` | Editar projeto (com CEP e códigos) |
| `/admin/projects/[id]` | Ver projeto admin (exibe códigos) |
| `/client/projects/[id]` | Ver projeto cliente (exibe códigos) |

---

## 🔐 SEGURANÇA DOS DADOS

### **Armazenamento:**

```sql
-- CEP no banco (sem formatação)
zipCode: '01310100'

-- CEP exibido (formatado)
Exibição: '01310-100'

-- Códigos de imóvel (preservando zeros)
propertyCodes: ['0123456789012345', '0000111122223333']
```

---

## 🚀 EXECUTE AGORA

**Passo 1:** Copie o SQL do arquivo `SQL_PROJETOS_CEP_E_CODIGOS.sql`

**Passo 2:** Cole no SQL Editor do Neon e execute

**Passo 3:** Execute no terminal:
```bash
npx prisma generate
```

**Passo 4:** Teste criando um novo projeto!

---

**Sistema profissional de gestão de projetos com integração ViaCEP!** 🎉
