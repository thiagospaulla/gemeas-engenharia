import { sendAppointmentReminders } from '../lib/notifications'

async function main() {
  console.log('🔔 Iniciando envio de lembretes automáticos...\n')
  console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}\n`)
  
  try {
    const result = await sendAppointmentReminders()
    
    if (result) {
      console.log('\n✅ Lembretes enviados com sucesso!')
    } else {
      console.log('\n⚠️ Nenhum lembrete para enviar hoje')
    }
  } catch (error) {
    console.error('\n❌ Erro ao enviar lembretes:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e)
    process.exit(1)
  })
