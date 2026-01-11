# 🏗️ Sistema Gêmeas Engenharia - Gestão Completa

## 📖 O Que Foi Criado?

Um sistema completo de gerenciamento para empresas de engenharia com **dois níveis de acesso**: **Administrador** e **Cliente**.

---

## 🎯 Funcionalidades Principais

### 👑 PARA ADMINISTRADORES

#### 1. **Gerenciamento de Clientes** 👥
- ✅ Aprovar novos cadastros
- 👑 Promover usuários a administrador
- ❌ Desativar/Ativar usuários
- 📊 Ver estatísticas completas

#### 2. **Gestão de Projetos** 🏗️
- ➕ Criar projetos para clientes
- 📊 Acompanhar progresso (0-100%)
- 🔄 Controlar status e fases da obra
- 📍 7 fases: Planejamento → Fundação → Estrutura → Alvenaria → Instalações → Acabamento → Finalização

#### 3. **Orçamentos** 💰
- ➕ Criar orçamentos detalhados com itens
- 📧 Enviar para aprovação do cliente
- 📊 Acompanhar status (Enviado, Aprovado, Rejeitado)
- 📄 Adicionar anexos e observações

#### 4. **Faturamento** 💵
- 🧾 Emitir faturas (geração automática de números)
- 💰 Controlar pagamentos
- ⏰ Detectar faturas atrasadas automaticamente
- 📊 Relatórios financeiros

#### 5. **Agenda** 📅
- 📅 Criar agendamentos (Reuniões, Visitas, Vistorias)
- ✅ Confirmar e concluir compromissos
- 📍 Definir local e horário
- 🔔 Notificações automáticas

#### 6. **Documentos** 📄
- 📤 Upload de arquivos (Contratos, Plantas, Laudos, Licenças)
- 📁 Organização por categoria e projeto
- 📥 Download e compartilhamento

#### 7. **Diário de Obras** 📝
- 📸 Registrar atividades diárias com fotos
- 👷 Controlar presença de trabalhadores
- 🌡️ Registrar condições climáticas
- 📦 Listar materiais e equipamentos

---

### 👤 PARA CLIENTES

#### 1. **Dashboard Pessoal** 📊
- Ver todos os seus projetos
- Acompanhar progresso em tempo real
- Estatísticas personalizadas

#### 2. **Meus Projetos** 🏠
- 👁️ Ver detalhes completos de cada projeto
- 📊 Acompanhar progresso e fase atual
- 📸 Ver fotos e atualizações diárias
- 📄 Acessar documentos relacionados

#### 3. **Orçamentos** 💼
- 👁️ Visualizar orçamentos recebidos
- ✅ Aprovar orçamentos
- ❌ Rejeitar orçamentos
- 📄 Ver itens discriminados

#### 4. **Faturas** 💳
- 👁️ Ver todas as faturas
- 📊 Acompanhar status (Pendente, Pago, Atrasado)
- 💰 Ver valores e datas de vencimento
- ⚠️ Alertas para faturas atrasadas

#### 5. **Agendamentos** 📆
- 👁️ Ver compromissos agendados
- ➕ Solicitar novos agendamentos
- 📍 Ver local, data e horário

#### 6. **Documentos** 📁
- 📤 Fazer upload de documentos
- 📥 Baixar arquivos do projeto
- 📋 Ver lista organizada por categoria

---

## 🔐 Sistema de Aprovação de Usuários

### Como Funciona:

```
1. Cliente se cadastra no site
   ↓
2. Conta é criada com status "PENDENTE"
   ↓
3. Cliente NÃO pode fazer login (aguardando aprovação)
   ↓
4. Admin recebe alerta de novo cadastro
   ↓
5. Admin acessa "Gerenciar Clientes"
   ↓
6. Admin clica em "APROVAR"
   ↓
7. Sistema ativa a conta e envia notificação
   ↓
8. Cliente pode fazer login ✅
```

---

## 🔔 Notificações Automáticas

O sistema envia notificações automaticamente em várias situações:

- ✅ **Conta aprovada** - Quando admin aprova novo cliente
- 👑 **Promovido a admin** - Quando usuário vira administrador
- 💰 **Novo orçamento** - Quando admin cria orçamento
- 💵 **Nova fatura** - Quando admin emite fatura
- ✅ **Fatura paga** - Quando pagamento é confirmado
- 📅 **Novo agendamento** - Quando compromisso é criado
- 🔄 **Status atualizado** - Mudanças em projetos/agendamentos

---

## 🗄️ Banco de Dados

### Novas Tabelas Criadas:

1. **budgets** - Orçamentos
2. **budget_items** - Itens dos orçamentos
3. **invoices** - Faturas/Faturamento
4. **appointments** - Agendamentos

### Campo Adicionado:

- **users.active** - Controla se usuário está aprovado (BOOLEAN)

---

## 📂 Estrutura de Arquivos

```
gemeas-engenharia-app/
│
├── 📄 SQL_MANUAL_SIMPLES.sql       ← Execute este SQL no banco
├── 📄 INICIO_RAPIDO.md             ← Comece por aqui!
├── 📄 CHECKLIST.md                 ← Lista de verificação
├── 📄 FUNCIONALIDADES.md           ← Documentação completa
├── 📄 DATABASE_SETUP.md            ← Setup detalhado do banco
├── 📄 RESUMO_IMPLEMENTACAO.md      ← O que foi feito
│
├── app/
│   ├── admin/
│   │   ├── clients/                ← Gerenciar clientes
│   │   ├── budgets/                ← Orçamentos
│   │   ├── invoices/               ← Faturamento
│   │   └── appointments/           ← Agenda
│   │
│   ├── client/
│   │   ├── budgets/                ← Ver orçamentos
│   │   └── invoices/               ← Ver faturas
│   │
│   └── api/
│       ├── users/[id]/             ← API de usuários
│       ├── budgets/                ← API de orçamentos
│       ├── invoices/               ← API de faturas
│       └── appointments/           ← API de agendamentos
│
├── scripts/
│   └── create-admin.ts             ← Script para criar admin
│
└── prisma/
    └── schema.prisma               ← Schema atualizado
```

---

## 🚀 Como Começar?

### Passo 1: Atualizar Banco de Dados

```bash
# Execute o SQL manual no PostgreSQL
psql -U seu_usuario -d seu_banco -f SQL_MANUAL_SIMPLES.sql

# OU use Prisma
npx prisma migrate dev --name add_new_features
npx prisma generate
```

### Passo 2: Criar Admin

```bash
npm run create-admin
```

**Credenciais:**
- Email: `admin@gemeas.com.br`
- Senha: `admin123`

### Passo 3: Iniciar

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🎨 Interface

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400/2C3E50/FFFFFF?text=Dashboard+Admin)

### Cliente Dashboard
![Cliente](https://via.placeholder.com/800x400/34495E/FFFFFF?text=Dashboard+Cliente)

---

## 🔑 Credenciais de Teste

### Admin Padrão:
- **Email:** admin@gemeas.com.br
- **Senha:** admin123
- **Acesso:** Total ao sistema

### Cliente de Teste:
1. Criar conta em `/register`
2. Aguardar aprovação do admin
3. Admin aprova em `/admin/clients`
4. Fazer login normalmente

---

## 📱 Rotas Principais

| Tipo | Rota | Descrição |
|------|------|-----------|
| 🔓 Público | `/login` | Login |
| 🔓 Público | `/register` | Cadastro de cliente |
| 👑 Admin | `/admin/dashboard` | Dashboard admin |
| 👑 Admin | `/admin/clients` | Gerenciar clientes |
| 👑 Admin | `/admin/budgets` | Orçamentos |
| 👑 Admin | `/admin/invoices` | Faturamento |
| 👑 Admin | `/admin/appointments` | Agenda |
| 👤 Cliente | `/client/dashboard` | Dashboard cliente |
| 👤 Cliente | `/client/projects` | Meus projetos |
| 👤 Cliente | `/client/budgets` | Meus orçamentos |
| 👤 Cliente | `/client/invoices` | Minhas faturas |

---

## 🛡️ Segurança

- ✅ Autenticação com JWT
- ✅ Senhas criptografadas (bcrypt)
- ✅ Middleware de autorização
- ✅ Validação de permissões por rota
- ✅ Cliente só acessa seus próprios dados
- ✅ Admin tem acesso total

---

## 📊 Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Next.js 16 | Framework React |
| TypeScript | Linguagem |
| PostgreSQL | Banco de dados |
| Prisma | ORM |
| Tailwind CSS | Estilos |
| Radix UI | Componentes |
| Lucide React | Ícones |
| JWT | Autenticação |
| bcryptjs | Criptografia |

---

## 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `INICIO_RAPIDO.md` | Guia de início rápido |
| `FUNCIONALIDADES.md` | Lista completa de funcionalidades |
| `DATABASE_SETUP.md` | Configuração do banco de dados |
| `RESUMO_IMPLEMENTACAO.md` | Resumo do que foi implementado |
| `CHECKLIST.md` | Lista de verificação |
| `SQL_MANUAL_SIMPLES.sql` | SQL para executar manualmente |

---

## 🎯 Status do Projeto

- ✅ Backend completo
- ✅ Frontend completo
- ✅ Autenticação
- ✅ Autorização
- ✅ Banco de dados
- ✅ APIs REST
- ✅ Interface responsiva
- ✅ Notificações
- ✅ Documentação

**Status:** 🟢 **PRONTO PARA USO**

---

## 🔧 Suporte

**Documentação:** Consulte os arquivos `.md` na raiz do projeto

**Problemas comuns:** Veja `CHECKLIST.md` seção "Debug"

**Início rápido:** Leia `INICIO_RAPIDO.md`

---

## 📈 Próximos Passos Recomendados

1. ✅ Testar todas as funcionalidades
2. 📧 Configurar envio de emails
3. ☁️ Configurar storage de arquivos (S3/Cloudinary)
4. 📱 Criar versão mobile
5. 🤖 Integrar IA para análise de projetos
6. 💳 Integrar gateway de pagamento
7. 📊 Criar mais relatórios e dashboards

---

## 🎉 Conclusão

Sistema completo de gerenciamento para empresa de engenharia implementado com sucesso!

**Principais recursos:**
- ✅ Controle total de usuários
- ✅ Gestão de projetos
- ✅ Orçamentos e propostas
- ✅ Controle financeiro
- ✅ Agenda de compromissos
- ✅ Upload de documentos
- ✅ Notificações automáticas
- ✅ Interface moderna e responsiva

---

**Desenvolvido para Gêmeas Engenharia** 🏗️

**Versão:** 1.0.0 | **Data:** Janeiro 2026 | **Status:** ✅ Completo
