# 🔌 Documentação da API - Gêmeas Engenharia

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer <token>
```

---

## 📍 Endpoints

### 🔑 Autenticação

#### POST `/api/auth/login`
Fazer login no sistema

**Body:**
```json
{
  "email": "admin@gemeas.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clx...",
    "name": "Administrador Gêmeas",
    "email": "admin@gemeas.com",
    "role": "ADMIN",
    "avatar": null
  }
}
```

#### POST `/api/auth/register`
Registrar novo cliente

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "(34) 99999-9999",
  "cpf": "123.456.789-00"
}
```

#### GET `/api/auth/me`
Obter dados do usuário logado

**Headers:**
```
Authorization: Bearer <token>
```

---

### 📁 Projetos

#### GET `/api/projects`
Listar todos os projetos

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "projects": [
    {
      "id": "clx...",
      "title": "Residência Moderna",
      "description": "Projeto residencial...",
      "type": "Residencial",
      "status": "EM_ANDAMENTO",
      "currentPhase": "ESTRUTURA",
      "progress": 45,
      "estimatedBudget": 850000,
      "actualBudget": 420000,
      "client": {
        "id": "clx...",
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "_count": {
        "documents": 3,
        "workDiaries": 5
      }
    }
  ]
}
```

#### POST `/api/projects`
Criar novo projeto (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Nova Residência",
  "description": "Descrição do projeto",
  "type": "Residencial",
  "status": "ORCAMENTO",
  "clientId": "clx...",
  "estimatedBudget": 500000,
  "address": "Rua das Flores, 123",
  "city": "Uberlândia",
  "state": "MG",
  "area": 250
}
```

#### GET `/api/projects/[id]`
Obter detalhes de um projeto

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "project": {
    "id": "clx...",
    "title": "Residência Moderna",
    "description": "...",
    "status": "EM_ANDAMENTO",
    "progress": 45,
    "client": { ... },
    "documents": [ ... ],
    "workDiaries": [ ... ],
    "phases": [ ... ]
  }
}
```

#### PUT `/api/projects/[id]`
Atualizar projeto (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Título Atualizado",
  "status": "EM_ANDAMENTO",
  "progress": 50,
  "actualBudget": 450000
}
```

#### DELETE `/api/projects/[id]`
Excluir projeto (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

---

### 📄 Documentos

#### POST `/api/documents`
Upload de documento

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "projectId": "clx...",
  "title": "Contrato de Prestação",
  "description": "Contrato assinado",
  "fileName": "contrato.pdf",
  "fileUrl": "/documents/contrato.pdf",
  "fileSize": 2097152,
  "fileType": "application/pdf",
  "category": "Contrato"
}
```

**Categorias disponíveis:**
- Contrato
- Planta
- Laudo
- Licença
- Foto
- Outro

---

### 📝 Diário de Obras

#### GET `/api/work-diaries`
Listar diários de obra (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `projectId` (opcional): Filtrar por projeto

**Response:**
```json
{
  "workDiaries": [
    {
      "id": "clx...",
      "date": "2024-12-20T00:00:00.000Z",
      "weather": "Ensolarado",
      "temperature": "28°C",
      "workersPresent": 12,
      "activities": "Concretagem das vigas...",
      "materials": "Concreto usinado...",
      "equipment": "Betoneira, Vibrador...",
      "observations": "Trabalho dentro do cronograma",
      "photos": [],
      "aiSummary": "Dia produtivo...",
      "aiInsights": "✅ Progresso conforme planejado...",
      "project": {
        "id": "clx...",
        "title": "Residência Moderna"
      }
    }
  ]
}
```

#### POST `/api/work-diaries`
Criar diário de obra (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "projectId": "clx...",
  "date": "2024-12-20",
  "weather": "Ensolarado",
  "temperature": "28°C",
  "workersPresent": 12,
  "activities": "Concretagem das vigas do segundo pavimento...",
  "materials": "Concreto usinado (15m³)...",
  "equipment": "Betoneira, Vibrador...",
  "observations": "Trabalho dentro do cronograma",
  "photos": []
}
```

**Nota:** Os campos `aiSummary` e `aiInsights` são gerados automaticamente.

---

### 👥 Usuários

#### GET `/api/users`
Listar usuários (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `role` (opcional): Filtrar por role (ADMIN ou CLIENT)

**Response:**
```json
{
  "users": [
    {
      "id": "clx...",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "CLIENT",
      "phone": "(34) 98765-4321",
      "cpf": "123.456.789-00",
      "city": "Uberlândia",
      "state": "MG",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "projects": 2
      }
    }
  ]
}
```

#### POST `/api/users`
Criar usuário (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "password": "senha123",
  "role": "CLIENT",
  "phone": "(34) 98888-7777",
  "cpf": "987.654.321-00",
  "address": "Av. Principal, 456",
  "city": "Uberlândia",
  "state": "MG",
  "zipCode": "38400-100"
}
```

---

### 📊 Relatórios

#### GET `/api/reports`
Listar relatórios (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reports": [
    {
      "id": "clx...",
      "title": "Relatório Gerencial - 20/12/2024",
      "type": "Gerencial",
      "content": "# Relatório Gerencial\n\n...",
      "data": "{...}",
      "period": "Mensal",
      "generatedAt": "2024-12-20T00:00:00.000Z",
      "project": null
    }
  ]
}
```

#### POST `/api/reports`
Gerar relatório (Admin apenas)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "type": "Gerencial",
  "projectId": "clx...",
  "period": "Mensal"
}
```

**Tipos de Relatório:**
- **Gerencial:** Visão geral de projetos, clientes e orçamentos
- **Financeiro:** Análise de custos estimados vs reais
- **Técnico:** Estatísticas de diários de obra e equipe
- **Progresso:** Acompanhamento de fases e conclusão

**Períodos:**
- Mensal
- Trimestral
- Anual

---

## 🔒 Permissões

### ADMIN
- ✅ Acesso total a todas as rotas
- ✅ Criar, editar e excluir projetos
- ✅ Gerenciar usuários
- ✅ Criar diários de obra
- ✅ Gerar relatórios
- ✅ Upload de documentos

### CLIENT
- ✅ Ver seus próprios projetos
- ✅ Ver documentos dos seus projetos
- ✅ Upload de documentos nos seus projetos
- ❌ Não pode criar/editar projetos
- ❌ Não pode ver diários de obra
- ❌ Não pode gerar relatórios
- ❌ Não pode ver outros clientes

---

## 📝 Enums

### UserRole
```typescript
enum UserRole {
  ADMIN
  CLIENT
}
```

### ProjectStatus
```typescript
enum ProjectStatus {
  ORCAMENTO
  EM_ANDAMENTO
  PAUSADO
  CONCLUIDO
  CANCELADO
}
```

### ProjectPhase
```typescript
enum ProjectPhase {
  PLANEJAMENTO
  FUNDACAO
  ESTRUTURA
  ALVENARIA
  INSTALACOES
  ACABAMENTO
  FINALIZACAO
}
```

---

## ⚠️ Códigos de Erro

- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (não autenticado)
- **403** - Forbidden (sem permissão)
- **404** - Not Found (recurso não encontrado)
- **500** - Internal Server Error (erro no servidor)

---

## 🧪 Testando a API

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gemeas.com","password":"admin123"}'

# Listar projetos
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Usando Postman/Insomnia

1. Importe a coleção de endpoints
2. Configure a variável de ambiente `baseUrl` = `http://localhost:3000`
3. Faça login e copie o token
4. Configure o token no header de autorização

---

**Desenvolvido com ❤️ para Gêmeas Engenharia**

