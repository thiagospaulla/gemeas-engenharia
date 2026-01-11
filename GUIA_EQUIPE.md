# 🧑‍🔧 Guia do Módulo de Equipe

## 📋 Visão Geral

O módulo de **Equipe** permite gerenciar todos os profissionais que trabalham nos projetos da empresa, incluindo engenheiros, arquitetos, mestres de obras, pedreiros, eletricistas e outros profissionais.

## 🎯 Funcionalidades

### ✅ Cadastro de Membros
- Nome completo, CPF, telefone, email
- Função/cargo (Engenheiro, Pedreiro, Eletricista, etc.)
- Status (Ativo, Inativo, Férias, Afastado)
- Especialização e habilidades
- Valores (por hora e diária)
- Data de contratação e nascimento
- Endereço completo
- Contato de emergência
- Documentos e certificações
- Observações

### 📊 Listagem e Filtros
- Visualização em cards com informações principais
- Busca por nome, email, telefone ou CPF
- Filtro por status (Ativo, Inativo, Férias, Afastado)
- Filtro por função/cargo
- Contador de projetos ativos por membro

### ✏️ Edição de Membros
- Atualização de todos os dados cadastrais
- Visualização de projetos atribuídos
- Histórico de projetos
- Exclusão de membros (com validação)

### 🔗 Atribuição a Projetos
- Vincular membros a projetos específicos
- Definir função no projeto
- Data de início e fim da participação
- Notas sobre a atribuição

## 🗄️ Estrutura do Banco de Dados

### Tabela: `team_members`
```sql
- id (TEXT, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- phone (TEXT)
- cpf (TEXT, UNIQUE)
- role (TeamMemberRole ENUM)
- status (TeamMemberStatus ENUM)
- specialization (TEXT)
- hourlyRate (FLOAT)
- dailyRate (FLOAT)
- hireDate (TIMESTAMP)
- birthDate (TIMESTAMP)
- address, city, state, zipCode (TEXT)
- emergencyContact, emergencyPhone (TEXT)
- documents (TEXT[])
- certifications (TEXT[])
- notes (TEXT)
- avatar (TEXT)
- active (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

### Tabela: `project_team_members`
```sql
- id (TEXT, PK)
- projectId (TEXT, FK -> projects)
- teamMemberId (TEXT, FK -> team_members)
- startDate (TIMESTAMP)
- endDate (TIMESTAMP)
- role (TEXT)
- notes (TEXT)
- createdAt, updatedAt (TIMESTAMP)
```

### Enums

**TeamMemberRole:**
- ENGENHEIRO
- ARQUITETO
- MESTRE_OBRAS
- PEDREIRO
- ELETRICISTA
- ENCANADOR
- PINTOR
- CARPINTEIRO
- SERVENTE
- OUTRO

**TeamMemberStatus:**
- ATIVO
- INATIVO
- FERIAS
- AFASTADO

## 🚀 Como Aplicar a Migração

### Opção 1: Via Neon Console (Recomendado)

1. Acesse o [Neon Console](https://console.neon.tech)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo do arquivo `SQL_TEAM_MIGRATION.sql`
5. Execute o SQL

### Opção 2: Via Linha de Comando

```bash
# Certifique-se de estar no diretório do projeto
cd gemeas-engenharia-app

# Execute a migração usando psql (se tiver acesso direto)
psql $DATABASE_URL -f SQL_TEAM_MIGRATION.sql
```

### Opção 3: Via Prisma (Desenvolvimento)

```bash
# Gerar o Prisma Client
npx prisma generate

# Aplicar migrações (apenas em desenvolvimento local)
npx prisma db push
```

## 📡 Rotas da API

### GET /api/team
Lista todos os membros da equipe

**Query Parameters:**
- `status` - Filtrar por status (ATIVO, INATIVO, FERIAS, AFASTADO)
- `role` - Filtrar por função
- `search` - Buscar por nome, email, telefone ou CPF

**Resposta:**
```json
[
  {
    "id": "clx...",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "11999999999",
    "cpf": "12345678900",
    "role": "PEDREIRO",
    "status": "ATIVO",
    "dailyRate": 250.00,
    "projectAssignments": [...]
  }
]
```

### POST /api/team
Cria um novo membro da equipe

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "role": "PEDREIRO",
  "status": "ATIVO",
  "hireDate": "2024-01-15",
  "dailyRate": 250.00
}
```

### GET /api/team/[id]
Busca um membro específico com seus projetos

### PUT /api/team/[id]
Atualiza os dados de um membro

### DELETE /api/team/[id]
Exclui um membro (apenas se não tiver projetos ativos)

### POST /api/team/[id]/projects
Atribui um membro a um projeto

**Body:**
```json
{
  "projectId": "clx...",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "role": "Pedreiro Principal",
  "notes": "Responsável pela alvenaria"
}
```

### GET /api/team/[id]/projects
Lista todos os projetos de um membro

## 🎨 Páginas

### `/admin/team`
**Listagem de Equipe**
- Cards com informações dos membros
- Filtros de busca, status e função
- Botão para adicionar novo membro
- Ações: Editar e Excluir

### `/admin/team/new`
**Cadastro de Novo Membro**
- Formulário completo com todas as informações
- Validação de campos obrigatórios
- Formatação automática de CPF, telefone e CEP
- Máscaras de entrada

### `/admin/team/[id]`
**Edição de Membro**
- Formulário de edição com dados pré-preenchidos
- Sidebar com projetos atribuídos
- Botão para excluir membro
- Histórico de projetos

## 🔐 Permissões

- **Acesso:** Apenas ADMIN
- **Visualização:** Todos os membros cadastrados
- **Criação:** Novos membros
- **Edição:** Dados de membros existentes
- **Exclusão:** Apenas membros sem projetos ativos

## 💡 Dicas de Uso

### Cadastro de Membros
1. Preencha todos os campos obrigatórios (*)
2. Use CPF sem formatação (será formatado automaticamente)
3. Telefone no formato (XX) XXXXX-XXXX
4. Defina valores de diária para facilitar orçamentos

### Atribuição a Projetos
1. Acesse a página de edição do membro
2. Clique no botão "+" na seção de projetos
3. Selecione o projeto e defina a função
4. Informe as datas de início e fim (opcional)

### Gestão de Status
- **ATIVO:** Membro trabalhando normalmente
- **INATIVO:** Membro não está mais na empresa
- **FERIAS:** Membro em período de férias
- **AFASTADO:** Membro afastado temporariamente

### Filtros e Busca
- Use a busca para encontrar rapidamente por nome, email ou CPF
- Filtre por status para ver apenas membros ativos
- Filtre por função para encontrar profissionais específicos

## 🐛 Resolução de Problemas

### Erro: "CPF já cadastrado"
- Verifique se o CPF já está em uso
- Use a busca para encontrar o membro existente

### Erro: "Não é possível excluir membro com projetos ativos"
- Finalize ou remova o membro dos projetos ativos primeiro
- Ou altere o status para INATIVO em vez de excluir

### Erro ao carregar dados
- Verifique sua conexão com a internet
- Verifique se o token de autenticação é válido
- Faça logout e login novamente

## 📱 Próximas Funcionalidades

- [ ] Upload de foto/avatar do membro
- [ ] Upload de documentos (RG, CPF, CTPS)
- [ ] Registro de certificações profissionais
- [ ] Controle de ponto/presença
- [ ] Relatório de horas trabalhadas
- [ ] Cálculo automático de pagamentos
- [ ] Integração com folha de pagamento
- [ ] Notificações de aniversário
- [ ] Histórico de treinamentos

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia
2. Verifique os logs do console do navegador
3. Entre em contato com o suporte técnico

---

**Desenvolvido para Gêmeas Engenharia** 🏗️
