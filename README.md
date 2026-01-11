# 🏗️ Gêmeas Engenharia - Sistema de Gestão

Sistema completo de gestão para empresas de construção civil e engenharia.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** (Neon) - Banco de dados
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis

## 📋 Funcionalidades

### Para Administradores
- ✅ Dashboard com métricas e gráficos
- ✅ Gestão de Projetos (CRUD completo)
- ✅ Gestão de Clientes
- ✅ Orçamentos e Aprovação
- ✅ Faturamento e Notas Fiscais
- ✅ Agenda de Compromissos
- ✅ Diário de Obras com IA
- ✅ Gestão de Equipe
- ✅ Gestão de Documentos
- ✅ Configurações e Usuários
- ✅ Relatórios

### Para Clientes
- ✅ Dashboard personalizado
- ✅ Visualização de Projetos
- ✅ Acompanhamento de Obras
- ✅ Orçamentos
- ✅ Faturas
- ✅ Agendamentos
- ✅ Documentos

## 🛠️ Instalação

### 1. Clonar o repositório

```bash
git clone git@github.com:thiagospaulla/gemeas-engenharia.git
cd gemeas-engenharia
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DATABASE_URL="sua_url_do_neon"
NEXTAUTH_SECRET="sua_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Aplicar migrações do banco

Execute os scripts SQL na ordem:

1. `SQL_COMPLETO_FINAL.sql` - Schema principal
2. `SQL_TEAM_MIGRATION.sql` - Módulo de equipe
3. `SQL_DOCUMENTS_MIGRATION.sql` - Módulo de documentos

**Via Neon Console:**
- Acesse https://console.neon.tech
- Selecione seu projeto
- Vá em SQL Editor
- Cole e execute cada script

**Ou via Prisma:**

```bash
npx prisma generate
npx prisma db push
```

### 5. Criar usuário admin

```bash
npm run create-admin
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📚 Documentação

- `GUIA_RAPIDO.md` - Guia rápido de uso
- `FUNCIONALIDADES.md` - Lista completa de funcionalidades
- `GUIA_EQUIPE.md` - Módulo de gestão de equipe
- `DOCUMENTOS_COMPLETO.md` - Módulo de documentos
- `CONFIGURACOES_ADMIN.md` - Configurações do admin
- `EXPORTACAO_ORCAMENTOS.md` - Exportação de orçamentos
- `API.md` - Documentação da API

## 🚀 Deploy na Vercel

### 1. Via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Acesse https://vercel.com
3. Clique em "New Project"
4. Importe o repositório do GitHub
5. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (URL da Vercel)
6. Clique em "Deploy"

### 2. Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 🔐 Variáveis de Ambiente para Produção

Configure na Vercel:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=sua-chave-secreta-32-caracteres
NEXTAUTH_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run lint         # Verificar código
npm run create-admin # Criar usuário admin
npm run seed         # Popular banco com dados de teste
```

## 🏗️ Estrutura do Projeto

```
gemeas-engenharia-app/
├── app/
│   ├── admin/          # Páginas do admin
│   ├── client/         # Páginas do cliente
│   ├── api/            # API Routes
│   └── ...
├── components/         # Componentes React
├── lib/                # Utilitários e configurações
├── prisma/             # Schema do banco
├── public/             # Arquivos estáticos
└── scripts/            # Scripts de manutenção
```

## 👥 Credenciais Padrão

Após criar o admin:

```
Email: admin@gemeas.com
Senha: (definida no script create-admin)
```

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação na pasta do projeto
2. Verifique os logs do console
3. Entre em contato com o suporte técnico

## 📄 Licença

Desenvolvido para Gêmeas Engenharia © 2024

---

**Sistema completo de gestão para engenharia civil** 🏗️
