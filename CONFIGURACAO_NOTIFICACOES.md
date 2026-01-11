# 📬 CONFIGURAÇÃO DE NOTIFICAÇÕES - WhatsApp e Email

## 🎯 VISÃO GERAL

Sistema profissional de notificações via WhatsApp e Email para agendamentos, com templates personalizados e lembretes automáticos.

---

## 📱 WHATSAPP (via Twilio)

### **1. Criar Conta no Twilio**

1. Acesse: https://www.twilio.com/
2. Crie uma conta gratuita
3. Ative o WhatsApp Sandbox ou compre um número

### **2. Obter Credenciais**

No painel do Twilio:
- **Account SID**: Encontre na página inicial
- **Auth Token**: Encontre na página inicial
- **WhatsApp Number**: Ex: `+14155238886` (sandbox) ou seu número

### **3. Configurar Variáveis de Ambiente**

Adicione no arquivo `.env`:

```bash
# TWILIO - WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### **4. Testar WhatsApp**

```bash
# No terminal
npm run send-test-whatsapp
```

---

## 📧 EMAIL (via Resend)

### **1. Criar Conta no Resend**

1. Acesse: https://resend.com/
2. Crie uma conta gratuita
3. Verifique seu domínio (ou use domínio de teste)

### **2. Obter API Key**

No painel do Resend:
1. Vá em **API Keys**
2. Clique em **Create API Key**
3. Copie a chave (começa com `re_`)

### **3. Configurar Variáveis de Ambiente**

Adicione no arquivo `.env`:

```bash
# RESEND - Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@suaempresa.com.br
```

### **4. Testar Email**

```bash
# No terminal
npm run send-test-email
```

---

## ⚙️ ALTERNATIVA: SendGrid

Se preferir usar SendGrid ao invés de Resend:

### **Configuração SendGrid:**

```bash
# .env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@suaempresa.com.br
```

### **Atualizar código:**

Em `lib/notifications.ts`, substituir a função `sendEmail`:

```typescript
export async function sendEmail(data: NotificationData): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'noreply@gemeas.com.br'
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: data.to }],
        subject: data.subject
      }],
      from: { email: fromEmail },
      content: [{
        type: 'text/html',
        value: generateEmailHTML(data)
      }]
    })
  })
  
  return response.ok
}
```

---

## 🔔 LEMBRETES AUTOMÁTICOS

### **Configurar Cron Job**

Os lembretes devem ser enviados automaticamente todos os dias.

#### **Opção 1: Cron do Sistema (Linux/Mac)**

```bash
# Editar crontab
crontab -e

# Adicionar linha (executa todo dia às 9h)
0 9 * * * cd /caminho/do/projeto && npm run send-reminders >> logs/reminders.log 2>&1
```

#### **Opção 2: Vercel Cron (se hospedar na Vercel)**

Criar arquivo `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

Criar API: `app/api/cron/send-reminders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentReminders } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  // Verificar token de segurança
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await sendAppointmentReminders()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

#### **Opção 3: Node-Cron (executar no servidor)**

Instalar:
```bash
npm install node-cron
```

Criar `server/cron.ts`:
```typescript
import cron from 'node-cron'
import { sendAppointmentReminders } from '../lib/notifications'

// Executar todos os dias às 9h
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Executando envio de lembretes...')
  await sendAppointmentReminders()
})
```

---

## 📝 TEMPLATES DE MENSAGENS

### **WhatsApp - Confirmação:**
```
🏗️ *GÊMEAS ENGENHARIA*

✅ *Agendamento Confirmado*

Olá, João Silva!

Seu agendamento foi confirmado:

📅 *Data:* 10 de janeiro de 2026
⏰ *Horário:* 14:00
📋 *Tipo:* Reunião
📍 *Local:* Escritório - Av. Paulista, 1000

📝 *Detalhes:*
Reunião de alinhamento do projeto

Qualquer dúvida, entre em contato conosco.

Atenciosamente,
Equipe Gêmeas Engenharia
```

### **WhatsApp - Lembrete:**
```
🏗️ *GÊMEAS ENGENHARIA*

⏰ *Lembrete de Agendamento*

Olá, João Silva!

Lembramos que você tem um compromisso:

📅 *Amanhã:* 10 de janeiro de 2026
⏰ *Horário:* 14:00
📋 *Tipo:* Reunião
📍 *Local:* Escritório - Av. Paulista, 1000

Nos vemos lá!

Equipe Gêmeas Engenharia
```

### **Email - Template HTML:**

Emails são enviados com template HTML profissional incluindo:
- ✅ Header com logo e cores da marca
- ✅ Conteúdo formatado
- ✅ Tabela com detalhes do agendamento
- ✅ Botões de ação
- ✅ Footer com copyright
- ✅ Responsivo (mobile-friendly)

---

## 🔧 CONFIGURAÇÃO COMPLETA DO .ENV

```bash
# Database
DATABASE_URL=sua_url_do_neon

# Auth
NEXTAUTH_SECRET=seu_secret_aleatorio

# TWILIO - WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# RESEND - Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@gemeas.com.br

# OU SENDGRID - Email (alternativa)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# EMAIL_FROM=noreply@gemeas.com.br

# CRON Secret (para lembretes automáticos)
CRON_SECRET=seu_secret_para_cron
```

---

## 🧪 TESTES

### **Testar Manualmente:**

```bash
# Enviar lembretes (testa agendamentos de amanhã)
npm run send-reminders
```

### **Testar no Sistema:**

1. Login como admin
2. Crie um agendamento para amanhã
3. Marque "Enviar notificações"
4. Salve
5. Verifique:
   - ✅ Email recebido (caixa de entrada)
   - ✅ WhatsApp recebido (se configurado)
   - ✅ Notificação no sistema

---

## 📊 QUANDO AS NOTIFICAÇÕES SÃO ENVIADAS

| Ação | Email | WhatsApp | Sistema |
|------|-------|----------|---------|
| Criar agendamento | ✅ | ✅ | ✅ |
| Confirmar agendamento | ✅ | ✅ | ✅ |
| Cancelar agendamento | ✅ | ✅ | ✅ |
| Atualizar dados | ✅ | ✅ | ✅ |
| **Lembrete 24h antes** | ✅ | ✅ | ✅ |

---

## 🚨 MODO DE DESENVOLVIMENTO

### **Sem Configurar APIs:**

Se não configurar Twilio ou Resend, o sistema irá:
- ✅ Simular envio no console
- ✅ Mostrar preview da mensagem
- ✅ Continuar funcionando normalmente
- ✅ Notificação no sistema funciona sempre

**Console:**
```
⚠️ Twilio não configurado. Simula envio de WhatsApp:
📱 Para: (11) 98765-4321
📝 Mensagem: 🏗️ GÊMEAS ENGENHARIA...

⚠️ Resend não configurado. Simula envio de Email:
📧 Para: cliente@email.com
📝 Assunto: ✅ Agendamento Confirmado
📄 Mensagem: Seu agendamento foi confirmado...
```

---

## 💰 CUSTOS

### **Twilio WhatsApp:**
- **Sandbox**: GRÁTIS (teste)
- **Produção**: ~$0.005 por mensagem (Brasil)
- **Número WhatsApp Business**: $1/mês

### **Resend Email:**
- **Grátis**: 3.000 emails/mês
- **Pro**: $20/mês (50.000 emails)

### **SendGrid Email:**
- **Grátis**: 100 emails/dia
- **Essentials**: $19.95/mês (50.000 emails)

---

## 🔐 SEGURANÇA

### **Boas Práticas:**

1. ✅ **Nunca commitar** o `.env`
2. ✅ Usar `.env.example` como template
3. ✅ Rotacionar tokens regularmente
4. ✅ Limitar rate de envio
5. ✅ Validar números de telefone
6. ✅ Validar emails

### **Arquivo .env.example:**

```bash
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=

# TWILIO - WhatsApp (opcional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# RESEND - Email (opcional)
RESEND_API_KEY=
EMAIL_FROM=
```

---

## 📈 MONITORAMENTO

### **Logs de Notificações:**

O sistema registra no console:
- ✅ Envios bem-sucedidos
- ❌ Falhas
- ⚠️ Avisos (API não configurada)

### **Exemplo de Log:**
```
🔔 Enviando notificação para João Silva
📧 Email: ✅ Enviado
📱 WhatsApp: ✅ Enviado
✅ Notificação completa!
```

---

## 🛠️ TROUBLESHOOTING

### **WhatsApp não envia:**

1. Verificar credenciais do Twilio
2. Verificar formato do número: `+5511987654321`
3. Verificar saldo da conta Twilio
4. Verificar se sandbox está ativado (dev)

### **Email não envia:**

1. Verificar API Key do Resend
2. Verificar domínio verificado
3. Verificar email "from" autorizado
4. Verificar limites de envio

### **Lembretes não funcionam:**

1. Verificar se cron está configurado
2. Verificar se script tem permissão
3. Verificar logs: `logs/reminders.log`
4. Testar manualmente: `npm run send-reminders`

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Desenvolvimento (Opcional):**
- [ ] Sistema funciona sem configuração
- [ ] Testa com simulação no console
- [ ] Notificações internas funcionam

### **Produção (Recomendado):**
- [ ] Criar conta no Twilio
- [ ] Obter credenciais do Twilio
- [ ] Adicionar variáveis no .env
- [ ] Testar WhatsApp em dev
- [ ] Criar conta no Resend
- [ ] Obter API Key do Resend
- [ ] Verificar domínio
- [ ] Adicionar variáveis no .env
- [ ] Testar Email em dev
- [ ] Configurar cron job para lembretes
- [ ] Testar envio de lembretes
- [ ] Monitorar logs de envio

---

## 🎯 EXEMPLO COMPLETO

### **Passo a Passo:**

1. **Admin cria agendamento:**
   ```
   Cliente: João Silva
   Email: joao@email.com
   Phone: (11) 98765-4321
   Data: 10/01/2026 às 14:00
   [✓] Enviar notificações
   ```

2. **Sistema envia imediatamente:**
   ```
   📧 Email para: joao@email.com
   Assunto: "✅ Agendamento Confirmado"
   Template HTML profissional
   
   📱 WhatsApp para: +5511987654321
   Mensagem formatada com detalhes
   ```

3. **Cron executa às 9h do dia anterior:**
   ```
   Script verifica: Agendamentos amanhã?
   Encontra: João Silva às 14:00
   
   Envia lembrete:
   📧 Email: "⏰ Lembrete: Agendamento Amanhã"
   📱 WhatsApp: "⏰ Lembrete..."
   ```

4. **Cliente recebe:**
   ```
   Dia 09/01 às 9h: Lembrete
   Dia 10/01 às 14h: Comparece ao compromisso ✅
   ```

---

## 📲 FORMATO DE NÚMEROS

### **WhatsApp aceita:**

```
Formato completo (com código do país):
+5511987654321

Sistema formata automaticamente de:
(11) 98765-4321 → whatsapp:+5511987654321
11987654321 → whatsapp:+5511987654321
```

---

## 🎨 PERSONALIZAÇÃO

### **Alterar Templates:**

Edite em `lib/notifications.ts`:

```typescript
function getAppointmentWhatsAppMessage(appointment, type) {
  // Personalize aqui
  return `Sua mensagem personalizada...`
}

function generateEmailHTML(data) {
  // Personalize o HTML aqui
  return `<html>...</html>`
}
```

### **Cores da Marca:**

Já configurado no template:
- Header: `#2C3E50` (azul escuro)
- Accent: `#C9A574` (dourado)
- Texto: `#555555`

---

## 💡 DICAS PROFISSIONAIS

1. ✅ **Use domínio próprio** para emails
   - Evita spam
   - Mais profissional
   - Melhor entregabilidade

2. ✅ **Valide números** antes de enviar
   - Formato correto
   - Código do país
   - Número ativo

3. ✅ **Monitore taxa de entrega**
   - Dashboards Twilio/Resend
   - Logs do sistema
   - Feedback dos clientes

4. ✅ **Respeite horários**
   - Lembretes: 9h-10h
   - Evite finais de semana
   - Considere timezone

5. ✅ **Tenha fallback**
   - Se WhatsApp falhar, email funciona
   - Notificação no sistema sempre funciona

---

## 📊 EXEMPLO DE ARQUIVO .ENV COMPLETO

```bash
# =====================================================
# VARIÁVEIS DE AMBIENTE - Gêmeas Engenharia
# =====================================================

# DATABASE (Neon)
DATABASE_URL="postgresql://user:pass@host/db"

# AUTH
NEXTAUTH_SECRET="seu_secret_aleatorio_muito_seguro"

# TWILIO - WhatsApp
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_twilio_auth_token_here"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# RESEND - Email
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@gemeas.com.br"

# CRON (para lembretes automáticos)
CRON_SECRET="secret_para_proteger_endpoint_cron"

# =====================================================
# DESENVOLVIMENTO: Deixe APIs vazias para simular
# PRODUÇÃO: Preencha todas as variáveis
# =====================================================
```

---

## 🚀 COMANDOS ÚTEIS

```bash
# Enviar lembretes manualmente
npm run send-reminders

# Ver logs de lembretes
tail -f logs/reminders.log

# Testar notificação específica
# (criar função de teste)
npm run test-notification
```

---

## ✅ ESTÁ PRONTO!

Sistema de notificações profissional configurado!

**Funciona sem configuração** (modo simulação)  
**Pronto para produção** (basta adicionar APIs)  
**Lembretes automáticos** (configurar cron)  

---

**Configure e comece a usar!** 📬🚀
