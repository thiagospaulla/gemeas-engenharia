# ✅ CHECKLIST DE IMPLEMENTAÇÃO

## 📋 Antes de Começar

- [ ] PostgreSQL está instalado e rodando
- [ ] Node.js está instalado (v18+)
- [ ] Arquivo `.env` está configurado com `DATABASE_URL`
- [ ] Dependências instaladas (`npm install`)

---

## 🗄️ Banco de Dados

- [ ] Executar migrations do Prisma OU SQL manual
  - **Opção A:** `npx prisma migrate dev --name add_new_features`
  - **Opção B:** `psql -U usuario -d banco -f migration_manual.sql`

- [ ] Verificar se tabelas foram criadas:
  - [ ] `budgets`
  - [ ] `budget_items`
  - [ ] `invoices`
  - [ ] `appointments`

- [ ] Verificar se campo `active` existe em `users`

- [ ] Verificar se enums foram criados:
  - [ ] `BudgetStatus`
  - [ ] `InvoiceStatus`
  - [ ] `AppointmentStatus`

---

## 👤 Usuário Admin

- [ ] Executar: `npm run create-admin`
- [ ] Anotar credenciais:
  - Email: `admin@gemeas.com.br`
  - Senha: `admin123`
- [ ] Testar login como admin
- [ ] ⚠️ Alterar senha do admin após primeiro login

---

## 🧪 Testes Básicos

### Teste de Autenticação
- [ ] Login como admin funciona
- [ ] Criar novo usuário cliente
- [ ] Tentar login com cliente (deve ser bloqueado)
- [ ] Aprovar cliente como admin
- [ ] Login com cliente aprovado funciona

### Teste de Orçamentos
- [ ] Admin consegue criar orçamento
- [ ] Cliente recebe notificação
- [ ] Cliente consegue visualizar orçamento
- [ ] Cliente consegue aprovar/rejeitar

### Teste de Faturas
- [ ] Admin consegue emitir fatura
- [ ] Número da fatura é gerado automaticamente
- [ ] Cliente consegue visualizar faturas
- [ ] Faturas atrasadas são marcadas automaticamente

### Teste de Agendamentos
- [ ] Admin consegue criar agendamento
- [ ] Cliente recebe notificação
- [ ] Cliente consegue visualizar agendamentos
- [ ] Status pode ser atualizado (Confirmado, Concluído)

### Teste de Navegação
- [ ] Sidebar mostra todos os links corretos (Admin)
- [ ] Sidebar mostra todos os links corretos (Cliente)
- [ ] Todas as rotas admin funcionam
- [ ] Todas as rotas cliente funcionam

---

## 🔐 Segurança

- [ ] Variável `NEXTAUTH_SECRET` configurada no `.env`
- [ ] `DATABASE_URL` está em `.env` (não no código)
- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Senhas são hasheadas com bcrypt
- [ ] JWT está configurado corretamente
- [ ] Middleware protege rotas admin
- [ ] Cliente só acessa seus próprios dados

---

## 📱 Interface

### Dashboard Admin
- [ ] Estatísticas aparecem corretamente
- [ ] Lista de projetos recentes funciona
- [ ] Cards com números corretos

### Página de Clientes
- [ ] Lista todos os usuários
- [ ] Filtros funcionam (Todos, Ativos, Pendentes, Admins)
- [ ] Botão "Aprovar" funciona
- [ ] Botão "Promover" funciona
- [ ] Botão "Desativar" funciona

### Página de Orçamentos
- [ ] Lista orçamentos corretamente
- [ ] Mostra status com cores
- [ ] Exibe valor total
- [ ] Itens são mostrados

### Página de Faturamento
- [ ] Lista faturas corretamente
- [ ] Mostra status (Pendente, Pago, Atrasado)
- [ ] Estatísticas corretas
- [ ] Valores formatados

### Página de Agenda
- [ ] Lista agendamentos corretamente
- [ ] Mostra data e hora formatadas
- [ ] Status com cores
- [ ] Botões de ação funcionam

### Dashboard Cliente
- [ ] Mostra projetos do cliente
- [ ] Barra de progresso funciona
- [ ] Estatísticas corretas
- [ ] Links funcionam

---

## 🔔 Notificações

- [ ] Notificação ao aprovar usuário
- [ ] Notificação ao promover a admin
- [ ] Notificação ao criar orçamento
- [ ] Notificação ao criar fatura
- [ ] Notificação ao criar agendamento
- [ ] Notificações aparecem no sistema

---

## 📄 Documentação

- [ ] `DATABASE_SETUP.md` criado
- [ ] `FUNCIONALIDADES.md` criado
- [ ] `RESUMO_IMPLEMENTACAO.md` criado
- [ ] `migration_manual.sql` criado
- [ ] `INICIO_RAPIDO.md` criado
- [ ] `CHECKLIST.md` criado (este arquivo)

---

## 🚀 Produção (Quando for publicar)

- [ ] Atualizar senha do admin
- [ ] Configurar backup automático do banco
- [ ] Usar HTTPS
- [ ] Configurar rate limiting
- [ ] Configurar CORS adequadamente
- [ ] Minificar e otimizar assets
- [ ] Configurar CDN para uploads
- [ ] Configurar envio de emails
- [ ] Testar em ambiente de staging
- [ ] Configurar monitoramento (Sentry, LogRocket)
- [ ] Criar documentação para usuários finais

---

## 📊 Performance

- [ ] Índices criados no banco de dados
- [ ] Queries otimizadas
- [ ] Paginação implementada (se necessário)
- [ ] Cache configurado (Redis - se necessário)
- [ ] Imagens otimizadas

---

## 🐛 Debug

### Se algo não funcionar:

**1. Verificar banco de dados:**
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

**2. Verificar usuários:**
```sql
SELECT id, name, email, role, active FROM users;
```

**3. Verificar logs:**
```bash
npm run dev
# Ver console do navegador (F12)
# Ver terminal do servidor
```

**4. Resetar banco (último recurso):**
```bash
npx prisma migrate reset
npm run create-admin
```

---

## ✅ Conclusão

Quando todos os checkboxes estiverem marcados, seu sistema está pronto para uso! 🎉

**Documentação de Apoio:**
- Início Rápido: `INICIO_RAPIDO.md`
- Funcionalidades Completas: `FUNCIONALIDADES.md`
- Setup do Banco: `DATABASE_SETUP.md`

**Contato de Suporte:**
- Issues: Abra uma issue no repositório
- Documentação: Consulte os arquivos .md

---

**Última Atualização:** Janeiro 2026
**Versão:** 1.0.0
**Status:** ✅ Completo
