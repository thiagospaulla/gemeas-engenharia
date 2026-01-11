# 🚀 INÍCIO RÁPIDO - Sistema Gêmeas Engenharia

## ⚡ 3 Passos para Começar

### 1️⃣ Atualizar Banco de Dados

Execute no terminal do PostgreSQL:

```bash
psql -U seu_usuario -d seu_banco -f migration_manual.sql
```

**OU** Use o Prisma:

```bash
npx prisma migrate dev --name add_new_features
npx prisma generate
```

---

### 2️⃣ Criar Usuário Admin

```bash
npm run create-admin
```

**Credenciais:**
- 📧 Email: `admin@gemeas.com.br`
- 🔑 Senha: `admin123`

---

### 3️⃣ Iniciar Sistema

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🎯 Testando o Sistema

### Teste 1: Login Admin
1. Acesse http://localhost:3000/login
2. Use: `admin@gemeas.com.br` / `admin123`
3. Você verá o dashboard admin

### Teste 2: Cadastro de Cliente
1. Acesse http://localhost:3000/register
2. Crie uma conta de teste
3. Tente fazer login (será bloqueado - "Aguardando aprovação")

### Teste 3: Aprovar Cliente
1. Login como admin
2. Vá em "Clientes" no menu lateral
3. Clique em "Aprovar" no usuário teste
4. Faça logout e login com o usuário teste
5. Agora funciona! 🎉

### Teste 4: Criar Orçamento
1. Login como admin
2. Vá em "Orçamentos" → "Novo Orçamento"
3. Crie um orçamento para o cliente teste
4. Login como cliente teste
5. Veja o orçamento em "Orçamentos"
6. Aprove ou rejeite

---

## 📱 Acessos Rápidos

### Admin:
- Dashboard: `/admin/dashboard`
- Clientes: `/admin/clients`
- Orçamentos: `/admin/budgets`
- Faturamento: `/admin/invoices`
- Agenda: `/admin/appointments`

### Cliente:
- Dashboard: `/client/dashboard`
- Meus Projetos: `/client/projects`
- Orçamentos: `/client/budgets`
- Faturas: `/client/invoices`

---

## 🔧 Comandos Úteis

```bash
# Ver logs do Prisma
npx prisma studio

# Verificar banco de dados
npx prisma db pull

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Ver schema atual
npx prisma format
```

---

## ❓ Problemas Comuns

**Erro: "active column does not exist"**
```sql
ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT false;
```

**Erro: "Can't reach database server"**
- Verifique se PostgreSQL está rodando
- Verifique DATABASE_URL no .env

**Login não funciona**
- Execute: `npm run create-admin`
- Verifique se o hash da senha está correto

---

## 📚 Documentação Completa

- `FUNCIONALIDADES.md` - Lista completa de funcionalidades
- `DATABASE_SETUP.md` - Guia detalhado do banco de dados
- `RESUMO_IMPLEMENTACAO.md` - Tudo que foi implementado
- `migration_manual.sql` - SQL para executar manualmente

---

## 💡 Dicas

✅ Sempre use HTTPS em produção
✅ Altere as senhas padrão
✅ Configure backup do banco
✅ Use variáveis de ambiente (.env)
✅ Teste tudo localmente antes de publicar

---

## 🎉 Pronto!

Seu sistema está rodando! 

Qualquer dúvida, consulte a documentação completa em `FUNCIONALIDADES.md`

**Boa sorte com seu projeto! 🏗️**
