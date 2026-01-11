# 🎯 Instruções de Uso - Gêmeas Engenharia

## 🚀 Como Iniciar o Sistema

### 1. Iniciar o Servidor

```bash
cd /Users/pc/Documents/vscode/twins/gemeas-engenharia-app
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

### 2. Acessar o Sistema

Abra seu navegador e acesse: `http://localhost:3000`

Você será redirecionado automaticamente para a página de login.

## 🔐 Credenciais de Acesso

### 👨‍💼 Administrador
- **Email:** admin@gemeas.com
- **Senha:** admin123
- **Acesso:** Dashboard completo com todas as funcionalidades

### 👤 Cliente 1
- **Email:** joao.silva@email.com
- **Senha:** cliente123
- **Projetos:** Residência Moderna e Casa de Campo

### 👤 Cliente 2
- **Email:** maria.santos@email.com
- **Senha:** cliente123
- **Projetos:** Edifício Comercial

## 📋 Funcionalidades por Perfil

### 🔧 Área Administrativa (Admin)

#### Dashboard
- Visualização de estatísticas gerais
- Total de projetos, clientes e orçamentos
- Lista de projetos recentes com status

#### Projetos
- Criar novos projetos
- Editar projetos existentes
- Visualizar detalhes completos
- Acompanhar progresso
- Gerenciar fases do projeto

#### Clientes
- Cadastrar novos clientes
- Visualizar lista de clientes
- Editar informações
- Ver projetos por cliente

#### Documentos
- Upload de documentos
- Categorização (Contrato, Planta, Laudo, Licença, etc)
- Organização por projeto
- Download de arquivos

#### Diário de Obras
- Registrar atividades diárias
- Informar clima e temperatura
- Listar trabalhadores presentes
- Adicionar fotos
- Insights automáticos com IA
- Histórico completo

#### Relatórios
- **Gerencial:** Visão geral de todos os projetos
- **Financeiro:** Análise de orçamentos e custos
- **Técnico:** Estatísticas de obra e equipe
- **Progresso:** Acompanhamento de fases e conclusão

### 👥 Área do Cliente

#### Dashboard
- Visualização dos seus projetos
- Progresso em tempo real
- Estatísticas personalizadas
- Notificações de atualizações

#### Meus Projetos
- Ver detalhes de cada projeto
- Acompanhar progresso com barra visual
- Status atualizado
- Informações de orçamento

#### Documentos
- Acessar documentos do projeto
- Fazer upload de documentos necessários
- Baixar contratos e plantas

## 🎨 Navegação

### Menu Lateral (Sidebar)

**Admin:**
- 📊 Dashboard
- 📁 Projetos
- 👥 Clientes
- 📄 Documentos
- 📝 Diário de Obras
- 👷 Equipe
- 📈 Relatórios
- ⚙️ Configurações
- 🚪 Sair

**Cliente:**
- 📊 Dashboard
- 📁 Meus Projetos
- 📄 Documentos
- 🚪 Sair

## 📊 Status dos Projetos

- 🔵 **Orçamento** - Projeto em fase de orçamento
- 🟢 **Em Andamento** - Projeto em execução
- 🟡 **Pausado** - Projeto temporariamente pausado
- ✅ **Concluído** - Projeto finalizado
- 🔴 **Cancelado** - Projeto cancelado

## 🏗️ Fases do Projeto

1. **Planejamento** - Planejamento e aprovações
2. **Fundação** - Fundação e terraplanagem
3. **Estrutura** - Estrutura de concreto
4. **Alvenaria** - Paredes e divisórias
5. **Instalações** - Elétrica, hidráulica, etc
6. **Acabamento** - Revestimentos e pintura
7. **Finalização** - Limpeza e entrega

## 💡 Dicas de Uso

### Para Administradores:

1. **Mantenha os diários de obra atualizados** - Isso gera insights automáticos e mantém os clientes informados

2. **Use categorias nos documentos** - Facilita a organização e busca

3. **Atualize o progresso regularmente** - Os clientes acompanham em tempo real

4. **Gere relatórios periodicamente** - Ajuda na tomada de decisões

### Para Clientes:

1. **Verifique notificações** - Fique por dentro das atualizações

2. **Faça upload de documentos solicitados** - Agiliza o processo

3. **Acompanhe o progresso** - Veja a evolução do seu projeto

## 🔄 Fluxo de Trabalho Recomendado

### Novo Projeto

1. **Admin cria o projeto** com informações básicas
2. **Admin adiciona fases** do projeto
3. **Admin faz upload** de documentos iniciais (projeto, alvará)
4. **Cliente recebe notificação** e pode acessar
5. **Cliente faz upload** de documentos necessários
6. **Admin atualiza diário de obras** diariamente
7. **Admin atualiza progresso** conforme avanço
8. **Admin gera relatórios** mensalmente

## 📱 Acesso Responsivo

O sistema funciona perfeitamente em:
- 💻 Computadores (Desktop)
- 📱 Tablets
- 📱 Celulares

## 🆘 Solução de Problemas

### Não consigo fazer login
- Verifique se digitou o email e senha corretamente
- Use as credenciais de teste fornecidas
- Limpe o cache do navegador

### Página não carrega
- Verifique se o servidor está rodando (`npm run dev`)
- Acesse `http://localhost:3000`
- Verifique o console do navegador para erros

### Erro ao criar projeto
- Verifique se está logado como Admin
- Preencha todos os campos obrigatórios
- Verifique a conexão com o banco de dados

## 🔧 Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Popular banco com dados de teste
npm run seed

# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# Abrir Prisma Studio (visualizar banco)
npx prisma studio
```

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: contato@gemeas.com.br
- 📞 Telefone: (34) 99282-0807
- 📍 Uberlândia - MG

---

**Desenvolvido com ❤️ para Gêmeas Engenharia**

*Transformando Sonhos em Realidade*

