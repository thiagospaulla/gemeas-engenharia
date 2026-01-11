# 📅 MÓDULO DE AGENDA - SISTEMA PROFISSIONAL COMPLETO

## 🎯 VISÃO GERAL

Sistema profissional de agendamento com notificações automáticas via **WhatsApp** e **Email**, lembretes inteligentes e integração total com projetos e clientes.

---

## ✨ FUNCIONALIDADES IMPLEMENTADAS

### **PARA ADMINISTRADOR** 👑

#### 1. **Criar Agendamento** (`/admin/appointments/new`)

✅ **Seleção Inteligente:**
- Lista todos os clientes
- Ao selecionar cliente:
  - Mostra email e telefone do cliente
  - Carrega projetos do cliente automaticamente
  - Permite vincular a projeto específico (opcional)

✅ **Tipos de Compromisso:**
- 📋 Reunião
- 🔍 Visita Técnica
- ✅ Vistoria
- 📦 Entrega
- 📏 Medição
- ✍️ Assinatura de Documentos

✅ **Data e Horário:**
- Data e hora de início
- Data e hora de término
- **Cálculo automático de duração**
- Validação: mínimo 15 minutos
- Validação: término após início

✅ **Localização:**
- Campo de endereço
- Dica para ser específico
- Integração com Google Maps

✅ **Observações:**
- Documentos necessários
- Preparações
- Instruções especiais

✅ **Sistema de Notificações:**
- Checkbox para ativar/desativar
- Preview dos contatos que receberão
- Confirmação de envio

✅ **Card de Resumo:**
- Preview em tempo real
- Todas as informações resumidas
- Duração calculada

#### 2. **Listar Agendamentos** (`/admin/appointments`)

✅ **Estatísticas:**
- Total de agendamentos
- Agendados
- Confirmados
- Concluídos

✅ **Timeline de Compromissos:**
- Ordenados por data
- Badges coloridos por status
- Informações completas visíveis
- Ações rápidas (Confirmar, Concluir)

✅ **Ações em Massa:**
- Confirmar múltiplos
- Visualizar detalhes
- Editar
- Cancelar

#### 3. **Visualizar Agendamento** (`/admin/appointments/[id]`)

✅ **Informações Completas:**
- Data e horário destacados
- Local com link para Google Maps
- Informações do cliente
- Projeto relacionado (se houver)
- Status atual

✅ **Ações Disponíveis:**
- Confirmar (notifica cliente)
- Marcar como concluído
- Cancelar (notifica cliente)
- Editar dados

---

### **PARA CLIENTE** 👤

#### 1. **Meus Agendamentos** (`/client/appointments`)

✅ **Separação Inteligente:**
- **Próximos Compromissos** (destaque)
  - Apenas agendamentos futuros
  - Status: AGENDADO ou CONFIRMADO
- **Histórico**
  - Agendamentos passados
  - Status: CONCLUIDO ou CANCELADO
  - Opacidade reduzida

✅ **Informações Visíveis:**
- Título, tipo, status
- Data e horário formatados
- Local (se definido)
- Descrição

✅ **Cards Clicáveis:**
- Clique para ver detalhes completos

#### 2. **Ver Detalhes** (`/client/appointments/[id]`)

✅ **Visualização Completa:**
- Data e hora destacadas
- Local com botão para Google Maps
- Descrição detalhada
- Observações
- Projeto relacionado

✅ **Alertas Contextuais:**
- **Aguardando Confirmação** (amarelo)
  - Quando status = AGENDADO
- **Confirmado** (verde)
  - Quando status = CONFIRMADO
  - Informa sobre lembrete 24h antes

✅ **Card de Lembretes:**
- Informa que receberá lembrete
- 24h antes do compromisso
- Email + WhatsApp

---

## 📬 SISTEMA DE NOTIFICAÇÕES

### **1. Notificação de Confirmação** (Imediata)

**Quando:** Admin cria agendamento com "Enviar notificações" marcado

**Enviado para:** Cliente

**Canais:**
- 📧 Email (template HTML profissional)
- 📱 WhatsApp (mensagem formatada)
- 🔔 Notificação no sistema

**Conteúdo:**
```
✅ Agendamento Confirmado

Olá, João Silva!

Seu agendamento foi confirmado:

📅 Data: 10 de janeiro de 2026
⏰ Horário: 14:00 - 15:00
📋 Tipo: Reunião
📍 Local: Escritório - Av. Paulista, 1000

Descrição: Reunião de alinhamento do projeto

Qualquer dúvida, entre em contato.

Atenciosamente,
Equipe Gêmeas Engenharia
```

### **2. Lembrete Automático** (24h antes)

**Quando:** Todo dia às 9h, script verifica agendamentos de amanhã

**Enviado para:** Todos os clientes com agendamento amanhã

**Canais:**
- 📧 Email
- 📱 WhatsApp
- 🔔 Notificação no sistema

**Conteúdo:**
```
⏰ Lembrete de Agendamento

Olá, João Silva!

Lembramos que você tem um compromisso:

📅 Amanhã: 10 de janeiro de 2026
⏰ Horário: 14:00
📋 Tipo: Reunião
📍 Local: Escritório - Av. Paulista, 1000

Nos vemos lá!

Equipe Gêmeas Engenharia
```

### **3. Notificação de Cancelamento**

**Quando:** Admin cancela agendamento

**Conteúdo:**
```
❌ Agendamento Cancelado

Informamos que o seguinte agendamento foi cancelado:

📅 Data: 10 de janeiro de 2026
⏰ Horário: 14:00
📋 Tipo: Reunião

Entre em contato para reagendar.

Atenciosamente,
Equipe Gêmeas Engenharia
```

---

## 🔄 FLUXO COMPLETO

```
1. ADMIN CRIA AGENDAMENTO
   ├─ Acessa /admin/appointments/new
   ├─ Seleciona cliente
   ├─ Define: Reunião, 10/01/2026, 14:00-15:00
   ├─ Local: Escritório
   ├─ [✓] Enviar notificações
   └─ Salva
   
2. SISTEMA ENVIA NOTIFICAÇÕES IMEDIATAS
   ├─ 📧 Email → joao@email.com
   ├─ 📱 WhatsApp → +5511987654321
   └─ 🔔 Notificação no sistema
   
3. CLIENTE RECEBE E VÊ
   ├─ Email na caixa de entrada
   ├─ WhatsApp no celular
   ├─ Notificação no painel
   └─ Compromisso em "Próximos"
   
4. DIA ANTERIOR (09/01 às 9h)
   ├─ Cron executa automaticamente
   ├─ Script busca agendamentos de amanhã
   ├─ Encontra compromisso de João
   └─ Envia lembretes:
      ├─ 📧 Email: "⏰ Lembrete..."
      └─ 📱 WhatsApp: "⏰ Lembrete..."
      
5. DIA DO COMPROMISSO (10/01)
   ├─ Cliente comparece às 14:00
   ├─ Admin marca como CONCLUÍDO
   └─ Status atualizado no sistema ✅
```

---

## 📊 DADOS SALVOS NO BANCO

```typescript
Appointment {
  id: "appt123"
  title: "Reunião de Alinhamento"
  description: "Revisar projeto e definir próximos passos"
  type: "Reunião"
  status: "CONFIRMADO"
  startTime: "2026-01-10T14:00:00.000Z"
  endTime: "2026-01-10T15:00:00.000Z"
  location: "Escritório - Av. Paulista, 1000"
  notes: "Trazer documentos do projeto"
  clientId: "client123"
  projectId: "project456" // Opcional
  createdAt: "2026-01-09T10:00:00.000Z"
  updatedAt: "2026-01-09T10:00:00.000Z"
}
```

---

## 🎨 INTERFACE PROFISSIONAL

### **Criar Agendamento:**
```
┌──────────────────────────────────────────┐
│ Novo Agendamento                         │
├──────────────────────────────────────────┤
│                                          │
│ Título: [Reunião de Alinhamento]        │
│ Tipo: [Reunião ▼]                       │
│ Cliente: [João Silva ▼]                 │
│   → Projetos carregados                  │
│ Projeto: [Casa Residencial ▼] (opcional)│
│                                          │
│ Data Início: [10/01/2026 14:00]         │
│ Data Fim: [10/01/2026 15:00]            │
│ ⏱️ Duração: 1 hora                       │
│                                          │
│ Local: [Escritório - Av. Paulista]      │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 📬 Notificações                    │  │
│ │ [✓] Enviar notificações automáticas│  │
│ │                                    │  │
│ │ Cliente receberá:                  │  │
│ │ 📧 Email: joao@email.com           │  │
│ │ 📱 WhatsApp: (11) 98765-4321       │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Criar Agendamento]                      │
└──────────────────────────────────────────┘
```

### **Cliente - Próximos Compromissos:**
```
┌──────────────────────────────────────────┐
│ Próximos Compromissos (2)                │
├──────────────────────────────────────────┤
│                                          │
│ 📅 Reunião de Alinhamento                │
│ ✅ CONFIRMADO  📋 Reunião                │
│ 📅 10/01/2026  ⏰ 14:00 - 15:00         │
│ 📍 Escritório - Av. Paulista, 1000      │
│                                          │
│ 🤖 Você receberá lembrete 24h antes     │
├──────────────────────────────────────────┤
│                                          │
│ 📅 Vistoria da Obra                      │
│ 🔵 AGENDADO  ✅ Vistoria                │
│ 📅 15/01/2026  ⏰ 10:00 - 11:30         │
│ 📍 Obra - Rua Exemplo, 123              │
└──────────────────────────────────────────┘
```

---

## 🎯 CASOS DE USO

### **Caso 1: Reunião Simples**
```
Tipo: Reunião
Cliente: Maria Silva
Projeto: Não vinculado
Data: 12/01/2026 às 10:00
Duração: 1 hora
Local: Escritório
[✓] Enviar notificações

→ Cliente recebe email e WhatsApp imediatamente
→ Dia 11/01 às 9h: Lembrete automático
→ Dia 12/01: Cliente comparece
→ Admin marca como concluído ✅
```

### **Caso 2: Vistoria Técnica**
```
Tipo: Vistoria
Cliente: João Santos
Projeto: Casa Residencial (vinculado)
Data: 15/01/2026 às 14:00
Duração: 2 horas
Local: Rua Exemplo, 123 - São Paulo
Observações: "Trazer documentos: RG, CPF, comprovante residência"
[✓] Enviar notificações

→ Cliente recebe com observações
→ Lembrete 24h antes
→ Vistoria realizada
→ Conclusão registrada no projeto
```

### **Caso 3: Entrega de Chaves**
```
Tipo: Entrega
Cliente: Carlos Lima
Projeto: Apartamento Centro (vinculado)
Data: 20/01/2026 às 16:00
Duração: 30 minutos
Local: No local da obra
Observações: "Conferir documentação final e realizar vistoria"
[✓] Enviar notificações

→ Email com checklist de documentos
→ WhatsApp com localização
→ Lembrete 24h antes
→ Entrega realizada ✅
```

---

## 🔔 CONFIGURAÇÃO DE NOTIFICAÇÕES

### **Serviços Necessários:**

#### **WhatsApp via Twilio:**
1. Criar conta: https://www.twilio.com
2. Obter credenciais (Account SID, Auth Token)
3. Configurar número WhatsApp

#### **Email via Resend:**
1. Criar conta: https://resend.com
2. Obter API Key
3. Verificar domínio

### **Arquivo .env:**
```bash
# WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Email
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=noreply@gemeas.com.br
```

**📄 Guia completo:** `CONFIGURACAO_NOTIFICACOES.md`

---

## ⏰ LEMBRETES AUTOMÁTICOS

### **Como Funciona:**

```
Script executa TODO DIA às 9h:
  ↓
Busca agendamentos para AMANHÃ
  ↓
Para cada agendamento:
  - Status: AGENDADO ou CONFIRMADO
  - Envia email para cliente
  - Envia WhatsApp para cliente
  - Aguarda 1 segundo (não sobrecarregar API)
  ↓
Todos os clientes notificados ✅
```

### **Configurar Cron:**

#### **Linux/Mac:**
```bash
crontab -e

# Adicionar (executa às 9h todo dia)
0 9 * * * cd /caminho/projeto && npm run send-reminders
```

#### **Windows Task Scheduler:**
```
Criar tarefa agendada:
- Diária às 9h
- Executar: npm run send-reminders
- Diretório: C:\caminho\projeto
```

#### **Vercel Cron:**
```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 📨 TEMPLATES DE MENSAGENS

### **WhatsApp - Confirmação:**
```
🏗️ GÊMEAS ENGENHARIA

✅ Agendamento Confirmado

Olá, João Silva!

Seu agendamento foi confirmado:

📅 Data: sexta-feira, 10 de janeiro de 2026
⏰ Horário: 14:00 - 15:00
📋 Tipo: Reunião
📍 Local: Escritório - Av. Paulista, 1000

📝 Detalhes:
Reunião de alinhamento do projeto

Qualquer dúvida, entre em contato.

Atenciosamente,
Equipe Gêmeas Engenharia
```

### **Email - Template HTML Profissional:**

Inclui:
- ✅ Header com logo e cores da marca (#2C3E50, #C9A574)
- ✅ Saudação personalizada
- ✅ Tabela formatada com detalhes
- ✅ Botões de ação
- ✅ Footer com copyright
- ✅ Design responsivo

---

## 📊 VALIDAÇÕES IMPLEMENTADAS

### **Backend:**
- ✅ Apenas admin pode criar/editar
- ✅ Cliente só vê seus agendamentos
- ✅ Validação de datas
- ✅ Cliente obrigatório

### **Frontend:**
- ✅ Horário término > início
- ✅ Duração mínima: 15 minutos
- ✅ Campos obrigatórios
- ✅ Formato de data válido
- ✅ Cálculo de duração em tempo real

---

## 🎨 RECURSOS DE UX

### **Admin:**
- ✅ Seleção de cliente carrega projetos automaticamente
- ✅ Duração calculada automaticamente (1h padrão)
- ✅ Preview de contatos para notificação
- ✅ Card de resumo em tempo real
- ✅ Validações com feedback claro
- ✅ Loading states
- ✅ Confirmações antes de ações

### **Cliente:**
- ✅ Separação: Próximos vs Histórico
- ✅ Alertas contextuais (aguardando, confirmado)
- ✅ Link direto para Google Maps
- ✅ Info sobre lembretes automáticos
- ✅ Visual clean e profissional

---

## 🔗 INTEGRAÇÕES

### **1. Com Projetos:**
- Admin pode vincular agendamento a projeto
- Cliente vê projeto relacionado
- Link rápido para detalhes do projeto

### **2. Com Clientes:**
- Carrega dados automáticos (email, telefone)
- Filtra projetos do cliente
- Notificação personalizada

### **3. Com Google Maps:**
- Botão "Ver no Google Maps"
- Abre automaticamente o local
- Facilita localização

### **4. Com Sistema de Notificações:**
- Notificação interna (sempre)
- Email (se configurado)
- WhatsApp (se configurado)

---

## 📱 ROTAS CRIADAS

| Tipo | Rota | Função |
|------|------|--------|
| 👑 Admin | `/admin/appointments` | Lista agendamentos |
| 👑 Admin | `/admin/appointments/new` | Criar agendamento |
| 👑 Admin | `/admin/appointments/[id]` | Ver e gerenciar |
| 👤 Cliente | `/client/appointments` | Meus agendamentos |
| 👤 Cliente | `/client/appointments/[id]` | Ver detalhes |

---

## 🧪 TESTE COMPLETO

### **Passo a Passo:**

1. **Criar Cliente:**
   ```
   Nome: Teste Silva
   Email: seu-email@teste.com
   Phone: (11) 98765-4321
   [✓] Ativar conta
   ```

2. **Criar Agendamento:**
   ```
   /admin/appointments/new
   Título: Reunião de Teste
   Tipo: Reunião
   Cliente: Teste Silva
   Data: Amanhã às 10:00
   Duração: 1 hora
   Local: Escritório Principal
   [✓] Enviar notificações
   Salvar
   ```

3. **Verificar Envios:**
   ```
   Terminal deve mostrar:
   ⚠️ Resend não configurado. Simula envio...
   📧 Para: seu-email@teste.com
   📱 Para: +5511987654321
   
   OU (se configurado):
   ✅ Email enviado!
   ✅ WhatsApp enviado!
   ```

4. **Cliente Ver:**
   ```
   Login como: seu-email@teste.com
   /client/appointments
   Ver em "Próximos Compromissos"
   Clicar para ver detalhes
   Ver botão Google Maps
   Ver alertas de confirmação
   ```

5. **Testar Lembretes:**
   ```
   npm run send-reminders
   
   Deve encontrar agendamento de amanhã
   Simular ou enviar lembretes
   ```

---

## 💡 MELHORIAS FUTURAS

### **Sugestões de Features:**

1. **Calendário Visual:**
   - Visualização mensal
   - Drag and drop
   - Cores por tipo

2. **Confirmação do Cliente:**
   - Botão "Confirmar Presença"
   - Link na notificação

3. **Reagendamento:**
   - Cliente pode solicitar reagendamento
   - Admin aprova nova data

4. **Integração com Google Calendar:**
   - Sincronização automática
   - Adicionar ao calendário

5. **WhatsApp Business:**
   - Mensagens com botões interativos
   - Confirmação com um clique

6. **Chamadas de Vídeo:**
   - Integração com Zoom/Meet
   - Link na notificação

---

## ✅ ESTÁ PRONTO PARA USO!

Sistema profissional de agenda implementado com:

- ✅ Criação de agendamentos
- ✅ Seleção inteligente de cliente/projeto
- ✅ Notificações imediatas (Email + WhatsApp)
- ✅ Lembretes automáticos 24h antes
- ✅ Templates profissionais
- ✅ Validações completas
- ✅ Interface moderna
- ✅ Acesso para cliente
- ✅ Integração com Google Maps
- ✅ Análise de duração
- ✅ Filtros e estatísticas
- ✅ Segurança total

---

## 🚀 COMANDOS

```bash
# Enviar lembretes manualmente
npm run send-reminders

# Ver documentação de configuração
cat CONFIGURACAO_NOTIFICACOES.md
```

---

## 📞 SUPORTE

**Problemas com notificações?**
→ Consulte `CONFIGURACAO_NOTIFICACOES.md`

**Dúvidas sobre funcionalidades?**
→ Este documento tem tudo!

---

**Sistema de Agenda Profissional completo!** 📅✨

**Teste agora e configure as APIs quando for para produção!** 🚀
