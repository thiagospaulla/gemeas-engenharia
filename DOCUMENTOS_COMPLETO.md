# 📁 Módulo de Documentos - Guia Completo

## ✅ Funcionalidade Implementada!

O módulo de **Gestão de Documentos** foi desenvolvido com suporte completo para vinculação a múltiplas entidades do sistema!

---

## 🎯 Funcionalidades Principais

### 1. 📤 **Upload de Documentos**
- Upload via URL (Google Drive, Dropbox, etc)
- Título e descrição personalizados
- Categorização (12 categorias disponíveis)
- Tags para organização
- Vinculação opcional a entidades

### 2. 🔗 **Vinculação Flexível**
Documentos podem ser vinculados a:
- **Projetos** - Plantas, contratos, licenças
- **Usuários** - RG, CPF, comprovantes pessoais
- **Orçamentos** - Propostas, anexos
- **Membros da Equipe** - CTPS, certificações, documentos pessoais
- **Sem vínculo** - Documentos gerais

### 3. 🔍 **Busca e Filtros**
- Busca por título, descrição, nome do arquivo
- Filtro por categoria
- Filtro por tipo de vínculo
- Resultados em tempo real

### 4. 📊 **Visualização e Gestão**
- Cards visuais com informações
- Preview e download
- Informações de tamanho e tipo
- Data de upload e autor
- Exclusão com confirmação

---

## 🗄️ Estrutura do Banco de Dados

### Modelo Document Atualizado

```prisma
model Document {
  id           String   @id @default(cuid())
  title        String
  description  String?
  fileName     String
  fileUrl      String
  fileSize     Int
  fileType     String
  category     String
  tags         String[]
  uploadedAt   DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Vínculos opcionais
  projectId    String?
  project      Project?
  
  userId       String?
  user         User?
  
  budgetId     String?
  budget       Budget?
  
  teamMemberId String?
  teamMember   TeamMember?
  
  uploadedById String
  uploadedBy   User
}
```

### Categorias Disponíveis

1. **Contrato** - Contratos de serviço, trabalho
2. **Planta** - Plantas arquitetônicas, projetos
3. **Laudo** - Laudos técnicos, perícias
4. **Licença** - Licenças, alvarás
5. **Certidão** - Certidões diversas
6. **RG** - Documento de identidade
7. **CPF** - Cadastro de pessoa física
8. **CTPS** - Carteira de trabalho
9. **Comprovante** - Comprovantes diversos
10. **Nota Fiscal** - Notas fiscais
11. **Recibo** - Recibos de pagamento
12. **Outro** - Outros documentos

---

## 🔌 API Routes

### GET /api/documents
Lista documentos com filtros

**Query Parameters:**
- `projectId` - Filtrar por projeto
- `userId` - Filtrar por usuário
- `budgetId` - Filtrar por orçamento
- `teamMemberId` - Filtrar por membro da equipe
- `category` - Filtrar por categoria
- `search` - Buscar por texto

**Response:**
```json
{
  "documents": [
    {
      "id": "clx...",
      "title": "Contrato de Obra",
      "description": "Contrato principal do projeto",
      "fileName": "contrato.pdf",
      "fileUrl": "https://...",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "category": "Contrato",
      "tags": ["importante", "assinado"],
      "uploadedAt": "2024-01-15T10:00:00Z",
      "uploadedBy": { "id": "...", "name": "Admin" },
      "project": { "id": "...", "title": "Projeto X" }
    }
  ]
}
```

---

### POST /api/documents
Upload de novo documento

**Request:**
```json
{
  "title": "Contrato de Obra",
  "description": "Contrato principal",
  "fileName": "contrato.pdf",
  "fileUrl": "https://drive.google.com/...",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "category": "Contrato",
  "tags": ["importante", "assinado"],
  "projectId": "clx..." // Opcional
}
```

**Response:**
```json
{
  "document": { ... }
}
```

**Validações:**
- ✅ Título obrigatório
- ✅ URL do arquivo obrigatória
- ✅ Categoria obrigatória
- ✅ Permissões verificadas

---

### GET /api/documents/[id]
Buscar documento específico

**Response:**
```json
{
  "document": {
    "id": "clx...",
    "title": "...",
    // ... todos os campos
  }
}
```

---

### PUT /api/documents/[id]
Atualizar documento

**Request:**
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "category": "Outra categoria",
  "tags": ["nova", "tag"]
}
```

---

### DELETE /api/documents/[id]
Excluir documento

**Response:**
```json
{
  "message": "Documento excluído com sucesso"
}
```

**Permissões:**
- ✅ Admin pode excluir qualquer documento
- ✅ Usuário pode excluir apenas seus próprios uploads

---

## 🎨 Interface do Usuário

### Página Principal (`/admin/documents`)

```
┌─────────────────────────────────────────────────────┐
│  Documentos                    [Upload Documento]   │
│  Gerencie todos os documentos do sistema            │
├─────────────────────────────────────────────────────┤
│  [Buscar...]  [Categoria ▼]  [Vínculo ▼]          │
│  Mostrando 15 de 20 documentos                      │
├─────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐             │
│  │ Contrato      │  │ Planta        │             │
│  │ Projeto X     │  │ Projeto Y     │             │
│  │ 2.5 MB        │  │ 5.1 MB        │             │
│  │ [Ver][Baixar] │  │ [Ver][Baixar] │             │
│  └───────────────┘  └───────────────┘             │
└─────────────────────────────────────────────────────┘
```

### Modal de Upload

```
┌─────────────────────────────────────────┐
│  Upload de Documento              [X]   │
├─────────────────────────────────────────┤
│  Título: *                              │
│  [_________________________________]    │
│                                         │
│  Descrição:                             │
│  [_________________________________]    │
│  [_________________________________]    │
│                                         │
│  Categoria: *        Tags:              │
│  [Contrato ▼]       [importante, ...]  │
│                                         │
│  URL do Arquivo: *                      │
│  [https://...]                          │
│                                         │
│  Vincular a:                            │
│  [Projeto ▼]        [Selecione... ▼]   │
│                                         │
│  [Enviar Documento]  [Cancelar]         │
└─────────────────────────────────────────┘
```

### Card de Documento

```
┌─────────────────────────────────┐
│ 📄 Contrato de Obra             │
├─────────────────────────────────┤
│ [Contrato]                      │
│                                 │
│ Descrição do documento...       │
│                                 │
│ 📁 contrato.pdf                 │
│ 2.5 MB                          │
│                                 │
│ 📂 Projeto: Casa Residencial    │
│                                 │
│ Enviado por: Admin              │
│ 📅 15/01/2024                   │
│                                 │
│ [Ver] [Baixar] [🗑️]             │
└─────────────────────────────────┘
```

---

## 🚀 Como Usar

### Upload de Documento

1. **Acesse a página:**
   - `/admin/documents`
   - Clique em "Upload Documento"

2. **Preencha o formulário:**
   - **Título:** Nome do documento
   - **Descrição:** Opcional, detalhes
   - **Categoria:** Selecione da lista
   - **Tags:** Palavras-chave (opcional)
   - **URL:** Link do arquivo hospedado
   - **Vincular a:** Opcional, selecione entidade

3. **Enviar:**
   - Clique em "Enviar Documento"
   - Aguarde confirmação
   - Documento aparece na lista

---

### Buscar Documentos

1. **Busca por texto:**
   - Digite no campo de busca
   - Busca em título, descrição, nome do arquivo

2. **Filtrar por categoria:**
   - Selecione categoria no dropdown
   - Ex: "Contrato", "Planta", "RG"

3. **Filtrar por vínculo:**
   - Selecione tipo de vínculo
   - Ex: "Projetos", "Usuários", "Sem vínculo"

4. **Limpar filtros:**
   - Clique em "Limpar filtros"

---

### Visualizar e Baixar

1. **Ver documento:**
   - Clique no botão "Ver"
   - Abre em nova aba

2. **Baixar documento:**
   - Clique no botão "Baixar"
   - Download inicia automaticamente

---

### Excluir Documento

1. **Clicar no ícone de lixeira**
2. **Confirmar exclusão**
3. **Documento removido do sistema**

**Atenção:**
- Exclusão é permanente
- Apenas admin ou autor pode excluir

---

## 💡 Casos de Uso

### Caso 1: Documento de Projeto
```
Categoria: Planta
Vínculo: Projeto "Casa Residencial"
Tags: aprovado, prefeitura
Uso: Planta aprovada pela prefeitura
```

### Caso 2: Documento Pessoal
```
Categoria: RG
Vínculo: Usuário "João Silva"
Tags: identificação
Uso: RG do cliente para contrato
```

### Caso 3: Documento de Equipe
```
Categoria: CTPS
Vínculo: Membro "Pedro Santos"
Tags: trabalhista
Uso: CTPS do pedreiro
```

### Caso 4: Documento de Orçamento
```
Categoria: Nota Fiscal
Vínculo: Orçamento "Reforma Comercial"
Tags: material, aprovado
Uso: NF de materiais do orçamento
```

### Caso 5: Documento Geral
```
Categoria: Certidão
Vínculo: Nenhum
Tags: empresa, legal
Uso: Certidão negativa da empresa
```

---

## 🔒 Segurança e Permissões

### Admin:
- ✅ Ver todos os documentos
- ✅ Upload para qualquer entidade
- ✅ Editar qualquer documento
- ✅ Excluir qualquer documento

### Cliente:
- ✅ Ver seus próprios documentos
- ✅ Ver documentos de seus projetos
- ✅ Upload para seus projetos
- ✅ Excluir apenas seus uploads

### Validações:
- ✅ Token obrigatório
- ✅ Verificação de permissões
- ✅ Validação de vínculos
- ✅ Confirmação de exclusão

---

## 📊 Estatísticas e Informações

### Informações Exibidas:
- Total de documentos
- Documentos filtrados
- Tamanho do arquivo
- Data de upload
- Autor do upload
- Entidade vinculada
- Categoria e tags

### Formatação:
- Tamanho em Bytes, KB, MB, GB
- Data formatada (DD/MM/AAAA)
- Ícones por tipo de vínculo
- Badges coloridos por categoria

---

## 🎨 Design e UX

### Cores:
- **Dourado (#C9A574):** Cabeçalhos, botões principais
- **Azul:** Badges de categoria
- **Verde:** Botão de download
- **Vermelho:** Botão de exclusão
- **Cinza:** Informações secundárias

### Ícones:
- 📄 Documento geral
- 📂 Projeto
- 👤 Usuário
- 💰 Orçamento
- 👥 Equipe
- 📅 Data
- 📁 Arquivo

### Responsividade:
- ✅ Desktop: 3 colunas
- ✅ Tablet: 2 colunas
- ✅ Mobile: 1 coluna
- ✅ Modal adaptável

---

## 📁 Arquivos Criados

### Schema:
- ✅ `prisma/schema.prisma` (atualizado)

### API:
- ✅ `/app/api/documents/route.ts`
- ✅ `/app/api/documents/[id]/route.ts`

### Páginas:
- ✅ `/app/admin/documents/page.tsx`

### Migração:
- ✅ `SQL_DOCUMENTS_MIGRATION.sql`

### Documentação:
- ✅ `DOCUMENTOS_COMPLETO.md` (este arquivo)

---

## 🔄 Migração do Banco

### Aplicar Migração:

**Opção 1 - Neon Console:**
1. Acesse https://console.neon.tech
2. Selecione seu projeto
3. Vá em SQL Editor
4. Cole o conteúdo de `SQL_DOCUMENTS_MIGRATION.sql`
5. Execute

**Opção 2 - Prisma:**
```bash
npx prisma generate
npx prisma db push
```

---

## 💡 Dicas de Uso

### Organização:
- Use tags consistentes
- Categorize corretamente
- Vincule sempre que possível
- Nomeie arquivos claramente

### Hospedagem de Arquivos:
- **Google Drive:** Compartilhe e copie link
- **Dropbox:** Gere link público
- **OneDrive:** Compartilhe e copie link
- **AWS S3:** Use URL pública

### Boas Práticas:
- Não faça upload de arquivos muito grandes
- Use nomes descritivos
- Adicione descrições úteis
- Mantenha documentos atualizados
- Exclua documentos obsoletos

---

## ❓ FAQ

### Como fazer upload de arquivos?
Cole a URL do arquivo hospedado (Google Drive, Dropbox, etc) no formulário.

### Posso vincular a múltiplas entidades?
Não, cada documento pode ter apenas um vínculo por vez.

### Posso mudar o vínculo depois?
Não diretamente. Você precisa excluir e fazer novo upload.

### Quem pode ver meus documentos?
Admin vê todos. Clientes veem apenas seus documentos e de seus projetos.

### Como organizar melhor?
Use categorias corretas, tags descritivas e vincule a entidades.

### Posso editar o arquivo depois?
Não. Você pode editar título, descrição, categoria e tags, mas não o arquivo.

---

## 🎉 Pronto para Uso!

O módulo de documentos está completo e funcional:

1. ✅ Upload com vinculação flexível
2. ✅ Busca e filtros avançados
3. ✅ Visualização e download
4. ✅ Gestão completa
5. ✅ Permissões e segurança

**Acesse:** `/admin/documents`

---

**Desenvolvido para Gêmeas Engenharia** 🏗️
*Gestão completa de documentos com vinculação inteligente!*
