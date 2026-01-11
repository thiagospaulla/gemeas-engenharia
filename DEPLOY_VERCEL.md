# 🚀 Deploy na Vercel - Guia Completo

## ✅ Código já está no GitHub!

Repositório: https://github.com/thiagospaulla/gemeas-engenharia

---

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

1. ✅ Código no GitHub (FEITO!)
2. ✅ Banco de dados Neon configurado
3. ✅ Variáveis de ambiente prontas
4. ✅ Conta na Vercel (criar em https://vercel.com)

---

## 🚀 Deploy via Interface Vercel (Recomendado)

### Passo 1: Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New"** → **"Project"**

### Passo 2: Importar Repositório

1. Encontre **"gemeas-engenharia"** na lista
2. Clique em **"Import"**

### Passo 3: Configurar Projeto

**Framework Preset:** Next.js (detectado automaticamente)
**Root Directory:** `.` (manter padrão)
**Build Command:** `npm run build` (manter padrão)
**Output Directory:** `.next` (manter padrão)

### Passo 4: Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```env
DATABASE_URL=postgresql://usuario:senha@endpoint.neon.tech:5432/neondb?sslmode=require
NEXTAUTH_SECRET=sua-chave-secreta-aqui-minimo-32-caracteres
NEXTAUTH_URL=https://seu-projeto.vercel.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL`: Copie do Neon Console
- `NEXTAUTH_SECRET`: Gere uma chave forte (32+ caracteres)
- `NEXTAUTH_URL`: Será a URL do Vercel (você pode atualizar depois)

**Como gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. ✅ Deploy concluído!

---

## 🔧 Deploy via CLI

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
cd gemeas-engenharia-app
vercel
```

Responda as perguntas:
- Set up and deploy? **Y**
- Which scope? Selecione sua conta
- Link to existing project? **N**
- What's your project's name? **gemeas-engenharia**
- In which directory is your code located? **./  **
- Want to override settings? **N**

### 4. Configurar Variáveis de Ambiente

```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NODE_ENV production
```

### 5. Deploy para Produção

```bash
vercel --prod
```

---

## 🗄️ Configuração do Banco de Dados

### Aplicar Migrações

**Importante:** Execute as migrações no Neon ANTES do deploy!

1. Acesse: https://console.neon.tech
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute na ordem:

```sql
-- 1. Schema principal
-- Cole e execute: SQL_COMPLETO_FINAL.sql

-- 2. Módulo de Equipe
-- Cole e execute: SQL_TEAM_MIGRATION.sql

-- 3. Módulo de Documentos
-- Cole e execute: SQL_DOCUMENTS_MIGRATION.sql
```

### Criar Usuário Admin

Após o deploy, você pode criar o admin via script local:

```bash
npm run create-admin
```

Ou criar manualmente via SQL:

```sql
INSERT INTO users (
  id,
  name,
  email,
  password,
  role,
  active,
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-001',
  'Administrador',
  'admin@gemeas.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ELnj2jVLbZ8C', -- senha: admin123
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

---

## 🌐 Configurar Domínio Personalizado

### Na Vercel:

1. Vá em **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio: `seudominio.com`
4. Siga as instruções para configurar DNS

### Atualizar NEXTAUTH_URL:

1. Vá em **Settings** → **Environment Variables**
2. Edite `NEXTAUTH_URL`
3. Altere para: `https://seudominio.com`
4. Clique em **"Save"**
5. Faça novo deploy: **Deployments** → **"Redeploy"**

---

## 🔒 Variáveis de Ambiente - Checklist

Confirme que todas estão configuradas na Vercel:

- [ ] `DATABASE_URL` - String de conexão do Neon
- [ ] `NEXTAUTH_SECRET` - Chave secreta (32+ chars)
- [ ] `NEXTAUTH_URL` - URL do projeto na Vercel
- [ ] `NODE_ENV` - `production`

---

## 🧪 Testar Aplicação

Após o deploy:

1. **Acesse a URL:** `https://seu-projeto.vercel.app`
2. **Teste o login:** Use credenciais do admin
3. **Verifique dashboard:** Deve carregar sem erros
4. **Teste funcionalidades:**
   - Criar projeto
   - Adicionar cliente
   - Criar orçamento
   - Upload documento

---

## 📊 Monitoramento

### Vercel Analytics

1. Vá em **Analytics** no dashboard da Vercel
2. Veja:
   - Número de visitas
   - Performance
   - Erros

### Logs

1. Vá em **Deployments**
2. Clique no deployment ativo
3. Veja logs em tempo real

---

## 🐛 Solução de Problemas

### Erro: "Module not found"

**Solução:**
```bash
# Localmente
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push

# Vercel fará redeploy automático
```

### Erro: "Database connection failed"

**Verificar:**
1. `DATABASE_URL` está correto?
2. IP da Vercel está permitido no Neon?
3. Banco tem as tabelas criadas?

**Solução:**
- Vá em Neon Console → Settings → IP Allow
- Adicione: `0.0.0.0/0` (permitir todos) temporariamente
- Ou adicione IPs específicos da Vercel

### Erro: "Invalid token"

**Solução:**
1. Verifique `NEXTAUTH_SECRET`
2. Verifique `NEXTAUTH_URL`
3. Limpe cookies do navegador
4. Tente fazer login novamente

### Erro 500 - Internal Server Error

**Debug:**
1. Vá em **Deployments** → Deployment ativo
2. Clique em **"Runtime Logs"**
3. Veja o erro específico
4. Corrija e faça push

### Build Failed

**Verificar:**
1. TypeScript errors?
2. Missing dependencies?
3. Environment variables?

**Solução:**
```bash
# Testar build localmente
npm run build

# Se funcionar, commit e push
git push
```

---

## 🔄 Fazer Update

### 1. Fazer alterações localmente

```bash
# Editar código
git add .
git commit -m "feat: nova funcionalidade"
git push
```

### 2. Vercel faz deploy automático!

- Cada push para `main` dispara novo deploy
- Veja progresso em: https://vercel.com/dashboard

### 3. Deploy manual (se necessário)

```bash
vercel --prod
```

---

## 📈 Performance

### Otimizações Automáticas da Vercel:

✅ CDN global
✅ Compressão automática
✅ Cache inteligente
✅ Image optimization
✅ Edge functions

### Recomendações:

1. **Imagens:** Use Next.js `<Image>` component
2. **Cache:** API routes têm cache automático
3. **SSR:** Páginas são server-rendered
4. **Static:** Assets em `/public` são cached

---

## 💰 Custos

### Plano Hobby (Grátis):

- ✅ Deployments ilimitados
- ✅ 100GB bandwidth/mês
- ✅ HTTPS automático
- ✅ Domínio personalizado
- ❌ Sem Analytics avançado
- ❌ Sem Password Protection

### Plano Pro ($20/mês):

- ✅ Tudo do Hobby
- ✅ Analytics avançado
- ✅ Password Protection
- ✅ Maior bandwidth
- ✅ Suporte prioritário

---

## 🎉 Checklist Final

Antes de considerar pronto:

- [ ] Deploy concluído sem erros
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Migrações do banco aplicadas
- [ ] Usuário admin criado
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Funcionalidades principais testadas
- [ ] Domínio personalizado configurado (opcional)
- [ ] SSL/HTTPS ativo
- [ ] Performance adequada

---

## 📞 Suporte

### Vercel:
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

### Projeto:
- GitHub: https://github.com/thiagospaulla/gemeas-engenharia
- Issues: https://github.com/thiagospaulla/gemeas-engenharia/issues

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar domínio personalizado
2. ✅ Ativar Vercel Analytics
3. ✅ Configurar backups do banco
4. ✅ Documentar credenciais
5. ✅ Treinar usuários
6. ✅ Monitorar performance

---

**🚀 Seu projeto está no ar!**

Acesse: https://seu-projeto.vercel.app

*Deploy feito com sucesso!* 🎉
