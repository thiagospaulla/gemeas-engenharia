# 🏗️ Sistema de Gerenciamento - Gêmeas Engenharia

## 📋 Visão Geral

Sistema completo de gerenciamento para empresa de engenharia com dois níveis de acesso: **Administrador** e **Cliente**.

---

## 👑 FUNCIONALIDADES DO ADMINISTRADOR

### 1. Dashboard Administrativo
- Visão geral de todos os projetos
- Estatísticas: projetos totais, ativos, clientes, orçamento total
- Listagem de projetos recentes com status e progresso
- Acesso rápido a todas as funcionalidades

### 2. Gerenciamento de Clientes
**Rota:** `/admin/clients`

#### Funcionalidades:
- ✅ **Aprovar Usuários**: Desbloquear clientes que fizeram cadastro
- 👑 **Promover a Admin**: Dar permissão de administrador para outros usuários
- ❌ **Desativar Usuários**: Bloquear acesso de usuários
- 📊 **Visualizar Estatísticas**: Total, ativos, pendentes, admins
- 🔍 **Filtrar**: Todos, Ativos, Pendentes, Administradores

#### Informações Exibidas:
- Nome, email, telefone
- CPF, cidade, estado
- Data de cadastro
- Quantidade de projetos
- Status (ativo/pendente)
- Role (admin/cliente)

### 3. Gerenciamento de Projetos
**Rota:** `/admin/projects`

#### Funcionalidades:
- ➕ **Criar Projetos**: Para qualquer cliente cadastrado
- 📝 **Editar Projetos**: Atualizar informações
- 📊 **Acompanhar Progresso**: Ver percentual de conclusão
- 🔄 **Alterar Status**: Orçamento → Em Andamento → Pausado → Concluído → Cancelado
- 📍 **Fases do Projeto**: 
  - Planejamento
  - Fundação
  - Estrutura
  - Alvenaria
  - Instalações
  - Acabamento
  - Finalização

#### Informações do Projeto:
- Título, descrição, tipo (Residencial/Comercial/Industrial)
- Cliente vinculado
- Datas (início, previsão de término)
- Orçamento estimado vs. real
- Endereço completo da obra
- Área em m²
- Progresso (0-100%)

### 4. Orçamentos
**Rota:** `/admin/budgets`

#### Funcionalidades:
- ➕ **Criar Orçamentos**: Com itens detalhados
- 📧 **Enviar para Cliente**: Notificação automática
- 📊 **Acompanhar Status**: 
  - Rascunho
  - Enviado
  - Aprovado
  - Rejeitado
  - Expirado
- 🗑️ **Deletar**: Remover orçamentos

#### Itens do Orçamento:
- Descrição do item
- Quantidade
- Unidade (m², m³, unidade, hora)
- Preço unitário
- Preço total
- Categoria (Material, Mão de obra, Equipamento)

#### Dados do Orçamento:
- Título e descrição
- Tipo de obra
- Cliente vinculado
- Projeto relacionado (opcional)
- Valor total
- Data de validade
- Anexos (PDFs, planilhas)
- Observações

### 5. Faturamento
**Rota:** `/admin/invoices`

#### Funcionalidades:
- ➕ **Emitir Faturas**: Geração automática de número
- 💰 **Registrar Pagamentos**: Marcar como pago
- 📅 **Controlar Vencimentos**: Detecção automática de atrasos
- 📊 **Status das Faturas**:
  - Pendente
  - Pago
  - Atrasado (detectado automaticamente)
  - Cancelado

#### Informações da Fatura:
- Número único da fatura (FAT-000001)
- Cliente
- Projeto vinculado (opcional)
- Valor
- Data de emissão
- Data de vencimento
- Data de pagamento (quando pago)
- Método de pagamento (PIX, Transferência, Cartão, Dinheiro)
- Anexos (notas fiscais, comprovantes)

#### Estatísticas:
- Valor total faturado
- Total recebido
- Faturas pendentes
- Faturas atrasadas

### 6. Agenda
**Rota:** `/admin/appointments`

#### Funcionalidades:
- ➕ **Criar Agendamentos**: Para clientes
- ✅ **Confirmar**: Agendamentos solicitados
- ✔️ **Concluir**: Marcar como realizado
- ❌ **Cancelar**: Cancelar compromissos
- 📅 **Filtrar por Data**: Ver agendamentos específicos

#### Tipos de Agendamento:
- Reunião
- Visita técnica
- Vistoria
- Entrega

#### Informações:
- Título e descrição
- Cliente vinculado
- Projeto relacionado (opcional)
- Data e hora (início e fim)
- Local
- Status (Agendado, Confirmado, Concluído, Cancelado)
- Observações

### 7. Documentos
**Rota:** `/admin/documents`

#### Funcionalidades:
- 📤 **Upload**: Qualquer tipo de arquivo
- 📁 **Categorizar**: 
  - Contratos
  - Plantas
  - Laudos
  - Licenças
  - Fotos
  - Outros
- 🔗 **Vincular a Projetos**: Organização por projeto
- 📥 **Download**: Acesso aos arquivos
- 🗑️ **Deletar**: Remover documentos

### 8. Diário de Obras
**Rota:** `/admin/work-diaries`

#### Funcionalidades:
- 📝 **Registrar Atividades Diárias**
- 📸 **Anexar Fotos**
- 👷 **Controlar Presença**: Número de trabalhadores
- 🌡️ **Condições Climáticas**: Tempo e temperatura
- 📦 **Materiais Utilizados**
- 🚜 **Equipamentos**
- 🤖 **IA**: Resumos e insights automáticos

### 9. Relatórios
**Rota:** `/admin/reports`

#### Tipos de Relatórios:
- 📊 **Gerencial**: Visão geral dos projetos
- 💰 **Financeiro**: Receitas, despesas, lucro
- 🔧 **Técnico**: Andamento de obras
- 📈 **Progresso**: Evolução dos projetos

---

## 👤 FUNCIONALIDADES DO CLIENTE

### 1. Dashboard do Cliente
**Rota:** `/client/dashboard`

#### Visualizações:
- 📊 **Estatísticas Pessoais**:
  - Total de projetos
  - Projetos em andamento
  - Total de documentos
- 📋 **Meus Projetos**: Lista completa com:
  - Status atual
  - Progresso (barra visual)
  - Orçamento
  - Data de criação
  - Número de documentos

### 2. Meus Projetos
**Rota:** `/client/projects`

#### O cliente pode:
- 👁️ **Visualizar Detalhes**: Informações completas
- 📊 **Acompanhar Progresso**: Ver percentual e fase atual
- 📄 **Ver Documentos**: Acessar arquivos do projeto
- 📸 **Ver Fotos**: Diário de obras com imagens
- 💬 **Observações**: Notas e atualizações

#### Informações Visíveis:
- Todas as informações do projeto
- Fase atual da obra
- Progresso detalhado
- Timeline de atualizações
- Documentos relacionados

### 3. Orçamentos
**Rota:** `/client/budgets`

#### O cliente pode:
- 👁️ **Visualizar**: Todos os orçamentos recebidos
- ✅ **Aprovar**: Aceitar orçamentos
- ❌ **Rejeitar**: Recusar orçamentos
- 📄 **Ver Detalhes**: 
  - Itens discriminados
  - Valores unitários e totais
  - Data de validade
  - Anexos

### 4. Faturas
**Rota:** `/client/invoices`

#### O cliente pode:
- 👁️ **Visualizar**: Todas as faturas
- 📊 **Acompanhar Status**:
  - Pendentes
  - Pagas
  - Atrasadas
- 📅 **Ver Vencimentos**: Datas importantes
- 💰 **Ver Valores**: Total, pago, pendente
- ⚠️ **Alertas**: Faturas atrasadas destacadas

### 5. Agendamentos
**Rota:** `/client/appointments`

#### O cliente pode:
- 👁️ **Visualizar**: Todos os compromissos
- ➕ **Solicitar**: Novos agendamentos
- 📅 **Ver Horários**: Data, hora, local
- 📝 **Ver Detalhes**: Tipo, descrição, notas

### 6. Documentos
**Rota:** `/client/documents`

#### O cliente pode:
- 📤 **Fazer Upload**: Enviar documentos
- 📥 **Baixar**: Documentos do projeto
- 📁 **Organizar**: Por categoria
- 👁️ **Visualizar**: Lista de todos os documentos

---

## 🔐 SISTEMA DE AUTENTICAÇÃO E AUTORIZAÇÃO

### Fluxo de Cadastro de Clientes:

1. **Cadastro**:
   ```
   Cliente preenche formulário → Conta criada com active=false
   ```

2. **Aguarda Aprovação**:
   ```
   Cliente não pode fazer login → Mensagem: "Aguardando aprovação do administrador"
   ```

3. **Aprovação pelo Admin**:
   ```
   Admin acessa /admin/clients → Clica em "Aprovar" → active=true
   ```

4. **Notificação**:
   ```
   Sistema envia notificação → "✅ Conta Aprovada!"
   ```

5. **Acesso Liberado**:
   ```
   Cliente pode fazer login → Acessa dashboard
   ```

### Promoção a Administrador:

```
Admin acessa /admin/clients → Seleciona usuário ativo → "Promover a Admin"
→ role = ADMIN + active = true → Notificação enviada
```

---

## 🔔 SISTEMA DE NOTIFICAÇÕES

### Notificações Automáticas:

1. **Conta Aprovada**: Quando admin aprova cliente
2. **Promovido a Admin**: Quando usuário vira admin
3. **Novo Orçamento**: Quando admin cria orçamento
4. **Nova Fatura**: Quando admin emite fatura
5. **Fatura Paga**: Quando pagamento é confirmado
6. **Novo Agendamento**: Quando compromisso é criado
7. **Status Atualizado**: Mudanças em agendamentos

---

## 🛠️ TECNOLOGIAS UTILIZADAS

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (jsonwebtoken)
- **Criptografia**: bcryptjs
- **UI**: Tailwind CSS + Radix UI
- **Ícones**: Lucide React

---

## 📱 ROTAS DO SISTEMA

### Admin:
- `/admin/dashboard` - Dashboard principal
- `/admin/clients` - Gerenciar clientes
- `/admin/projects` - Gerenciar projetos
- `/admin/budgets` - Orçamentos
- `/admin/invoices` - Faturamento
- `/admin/appointments` - Agenda
- `/admin/documents` - Documentos
- `/admin/work-diaries` - Diário de obras
- `/admin/reports` - Relatórios

### Cliente:
- `/client/dashboard` - Dashboard do cliente
- `/client/projects` - Meus projetos
- `/client/budgets` - Meus orçamentos
- `/client/invoices` - Minhas faturas
- `/client/appointments` - Meus agendamentos
- `/client/documents` - Meus documentos

### Públicas:
- `/login` - Login
- `/register` - Cadastro de cliente

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. ✅ Executar migrations do banco
2. ✅ Criar usuário admin
3. 📧 Configurar envio de emails
4. 💾 Configurar storage de arquivos (AWS S3 / Cloudinary)
5. 🔒 Implementar 2FA para admins
6. 📱 Criar versão mobile (React Native)
7. 📊 Dashboard com gráficos avançados
8. 🤖 Integração com IA para análise de projetos
