// Sistema de Notificações - WhatsApp e Email
// Preparado para integração com Twilio e Resend/SendGrid

import { prisma } from './prisma'

interface NotificationData {
  to: string // Email ou telefone
  name: string
  subject: string
  message: string
  type: 'appointment' | 'reminder' | 'confirmation' | 'cancellation' | 'update'
  data?: any
}

// ==================== WHATSAPP ====================

export async function sendWhatsApp(data: NotificationData): Promise<boolean> {
  try {
    // TWILIO CONFIG (adicione no .env):
    // TWILIO_ACCOUNT_SID=seu_account_sid
    // TWILIO_AUTH_TOKEN=seu_auth_token
    // TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'
    
    if (!accountSid || !authToken) {
      console.log('⚠️ Twilio não configurado. Simula envio de WhatsApp:')
      console.log(`📱 Para: ${data.to}`)
      console.log(`📝 Mensagem: ${data.message}`)
      return true // Simular sucesso
    }

    // Formatar número para WhatsApp (deve ter código do país)
    const toNumber = formatPhoneForWhatsApp(data.to)

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: data.message
      })
    })

    if (response.ok) {
      console.log('✅ WhatsApp enviado com sucesso!')
      return true
    } else {
      console.error('❌ Erro ao enviar WhatsApp:', await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Erro no envio de WhatsApp:', error)
    return false
  }
}

function formatPhoneForWhatsApp(phone: string): string {
  // Remove formatação e adiciona whatsapp: prefix
  const numbers = phone.replace(/\D/g, '')
  
  // Se não tem código do país, assume Brasil (+55)
  if (numbers.length === 11) {
    return `whatsapp:+55${numbers}`
  } else if (numbers.length === 10) {
    return `whatsapp:+55${numbers}`
  }
  
  return `whatsapp:+${numbers}`
}

// ==================== EMAIL ====================

export async function sendEmail(data: NotificationData): Promise<boolean> {
  try {
    // RESEND CONFIG (adicione no .env):
    // RESEND_API_KEY=re_seu_api_key
    // EMAIL_FROM=noreply@suaempresa.com.br
    
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.EMAIL_FROM || 'noreply@gemeas.com.br'
    
    if (!apiKey) {
      console.log('⚠️ Resend não configurado. Simula envio de Email:')
      console.log(`📧 Para: ${data.to}`)
      console.log(`📝 Assunto: ${data.subject}`)
      console.log(`📄 Mensagem: ${data.message}`)
      return true // Simular sucesso
    }

    const htmlContent = generateEmailHTML(data)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: data.to,
        subject: data.subject,
        html: htmlContent
      })
    })

    if (response.ok) {
      console.log('✅ Email enviado com sucesso!')
      return true
    } else {
      console.error('❌ Erro ao enviar email:', await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Erro no envio de email:', error)
    return false
  }
}

// ==================== TEMPLATES ====================

export function getAppointmentWhatsAppMessage(appointment: any, type: 'confirmation' | 'reminder' | 'cancellation'): string {
  const dateFormatted = new Date(appointment.startTime).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
  
  const timeFormatted = new Date(appointment.startTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  switch (type) {
    case 'confirmation':
      return `🏗️ *GÊMEAS ENGENHARIA*

✅ *Agendamento Confirmado*

Olá, ${appointment.client?.name}!

Seu agendamento foi confirmado:

📅 *Data:* ${dateFormatted}
⏰ *Horário:* ${timeFormatted}
📋 *Tipo:* ${appointment.type}
📍 *Local:* ${appointment.location || 'A definir'}

📝 *Detalhes:*
${appointment.description || appointment.title}

Qualquer dúvida, entre em contato conosco.

Atenciosamente,
Equipe Gêmeas Engenharia`

    case 'reminder':
      return `🏗️ *GÊMEAS ENGENHARIA*

⏰ *Lembrete de Agendamento*

Olá, ${appointment.client?.name}!

Lembramos que você tem um compromisso:

📅 *Amanhã:* ${dateFormatted}
⏰ *Horário:* ${timeFormatted}
📋 *Tipo:* ${appointment.type}
📍 *Local:* ${appointment.location || 'A definir'}

Nos vemos lá!

Equipe Gêmeas Engenharia`

    case 'cancellation':
      return `🏗️ *GÊMEAS ENGENHARIA*

❌ *Agendamento Cancelado*

Olá, ${appointment.client?.name}!

Informamos que o seguinte agendamento foi cancelado:

📅 *Data:* ${dateFormatted}
⏰ *Horário:* ${timeFormatted}
📋 *Tipo:* ${appointment.type}

Entre em contato para reagendar.

Atenciosamente,
Equipe Gêmeas Engenharia`
  }
}

function generateEmailHTML(data: NotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #C9A574; font-size: 32px; font-weight: bold;">
                GÊMEAS
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                Engenharia e Construção
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #2C3E50; font-size: 24px;">
                ${data.subject}
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Olá, <strong>${data.name}</strong>!
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #C9A574; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #2C3E50; font-size: 16px; line-height: 1.8; white-space: pre-line;">
                  ${data.message}
                </p>
              </div>
              
              ${data.data ? generateAppointmentDetails(data.data) : ''}
              
              <p style="margin: 20px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                Atenciosamente,<br>
                <strong>Equipe Gêmeas Engenharia</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                © ${new Date().getFullYear()} Gêmeas Engenharia. Todos os direitos reservados.
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px;">
                Este é um e-mail automático, não responda diretamente.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

function generateAppointmentDetails(appointment: any): string {
  const dateFormatted = new Date(appointment.startTime).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  })
  
  const timeStart = new Date(appointment.startTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const timeEnd = new Date(appointment.endTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
    <table width="100%" style="margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #C9A574; color: white; padding: 15px; font-weight: bold; font-size: 16px;">
          📅 Detalhes do Agendamento
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr>
              <td style="color: #888; font-size: 14px; width: 120px;">Data:</td>
              <td style="color: #2C3E50; font-size: 14px; font-weight: bold;">${dateFormatted}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 14px;">Horário:</td>
              <td style="color: #2C3E50; font-size: 14px; font-weight: bold;">${timeStart} - ${timeEnd}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 14px;">Tipo:</td>
              <td style="color: #2C3E50; font-size: 14px; font-weight: bold;">${appointment.type}</td>
            </tr>
            ${appointment.location ? `
            <tr>
              <td style="color: #888; font-size: 14px;">Local:</td>
              <td style="color: #2C3E50; font-size: 14px; font-weight: bold;">${appointment.location}</td>
            </tr>
            ` : ''}
            ${appointment.notes ? `
            <tr>
              <td style="color: #888; font-size: 14px; vertical-align: top;">Observações:</td>
              <td style="color: #555; font-size: 14px;">${appointment.notes}</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
  `
}

// ==================== FUNÇÕES AUXILIARES ====================

export async function sendAppointmentNotification(
  appointment: any,
  type: 'confirmation' | 'reminder' | 'cancellation' | 'update'
) {
  try {
    const client = appointment.client
    
    if (!client) {
      console.error('Cliente não encontrado no agendamento')
      return false
    }

    // Preparar dados
    const notificationData: NotificationData = {
      to: client.email,
      name: client.name,
      subject: getEmailSubject(type, appointment),
      message: getEmailMessage(type, appointment),
      type: 'appointment',
      data: appointment
    }

    // Enviar Email
    const emailSent = await sendEmail(notificationData)

    // Enviar WhatsApp (se telefone disponível)
    let whatsappSent = false
    if (client.phone) {
      const whatsappData = {
        ...notificationData,
        to: client.phone,
        message: getAppointmentWhatsAppMessage(appointment, type)
      }
      whatsappSent = await sendWhatsApp(whatsappData)
    }

    console.log(`📧 Email: ${emailSent ? '✅' : '❌'}`)
    console.log(`📱 WhatsApp: ${whatsappSent ? '✅' : '❌'}`)

    return emailSent || whatsappSent
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    return false
  }
}

function getEmailSubject(type: string, appointment: any): string {
  const subjects: any = {
    confirmation: '✅ Agendamento Confirmado - Gêmeas Engenharia',
    reminder: '⏰ Lembrete: Agendamento Amanhã - Gêmeas Engenharia',
    cancellation: '❌ Agendamento Cancelado - Gêmeas Engenharia',
    update: '🔄 Agendamento Atualizado - Gêmeas Engenharia'
  }
  return subjects[type] || 'Notificação - Gêmeas Engenharia'
}

function getEmailMessage(type: string, appointment: any): string {
  const messages: any = {
    confirmation: `Seu agendamento "${appointment.title}" foi confirmado com sucesso!\n\nEstamos ansiosos para atendê-lo.`,
    reminder: `Lembramos que você tem um agendamento amanhã: "${appointment.title}".\n\nPrepare-se para o compromisso!`,
    cancellation: `O agendamento "${appointment.title}" foi cancelado.\n\nEntre em contato para reagendar se necessário.`,
    update: `O agendamento "${appointment.title}" foi atualizado.\n\nConfira os novos detalhes abaixo.`
  }
  return messages[type] || 'Seu agendamento foi processado.'
}

// ==================== LEMBRETES AUTOMÁTICOS ====================

export async function sendAppointmentReminders() {
  try {
    // Buscar agendamentos para amanhã
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: dayAfter
        },
        status: {
          in: ['AGENDADO', 'CONFIRMADO']
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    console.log(`📬 Enviando ${appointments.length} lembretes...`)

    for (const appointment of appointments) {
      await sendAppointmentNotification(appointment, 'reminder')
      
      // Aguardar 1 segundo entre envios para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('✅ Lembretes enviados!')
    return true
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error)
    return false
  }
}

// ==================== EXPORT ====================

export { NotificationData }
