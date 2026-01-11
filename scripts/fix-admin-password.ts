import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Corrigindo senha do administrador...\n')

  const email = 'admin@gemeas.com.br'
  const newPassword = 'admin123'

  // Verificar se admin existe
  const admin = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, active: true, password: true }
  })

  if (!admin) {
    console.log('❌ Admin não encontrado no banco!')
    console.log('Execute: npm run create-admin\n')
    return
  }

  console.log('✅ Admin encontrado:')
  console.log(`   ID: ${admin.id}`)
  console.log(`   Nome: ${admin.name}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Role: ${admin.role}`)
  console.log(`   Active: ${admin.active}`)
  console.log(`   Hash atual: ${admin.password.substring(0, 20)}...\n`)

  // Gerar novo hash
  console.log('🔑 Gerando novo hash da senha...')
  const newHashedPassword = await bcrypt.hash(newPassword, 12)
  console.log(`   Novo hash: ${newHashedPassword.substring(0, 20)}...\n`)

  // Testar se o hash atual funciona
  console.log('🧪 Testando hash atual...')
  const currentHashWorks = await bcrypt.compare(newPassword, admin.password)
  console.log(`   Hash atual funciona: ${currentHashWorks ? '✅ SIM' : '❌ NÃO'}\n`)

  if (currentHashWorks) {
    console.log('✅ A senha já está correta!')
    console.log('O problema pode estar em outro lugar.\n')
    console.log('Tente fazer logout completo e limpar o cache do navegador.\n')
    return
  }

  // Atualizar senha
  console.log('🔄 Atualizando senha no banco...')
  await prisma.user.update({
    where: { email },
    data: {
      password: newHashedPassword,
      active: true // Garantir que está ativo
    }
  })

  // Verificar se funcionou
  const updatedAdmin = await prisma.user.findUnique({
    where: { email },
    select: { password: true, active: true }
  })

  const newHashWorks = await bcrypt.compare(newPassword, updatedAdmin!.password)

  console.log('✅ Senha atualizada com sucesso!')
  console.log(`   Novo hash funciona: ${newHashWorks ? '✅ SIM' : '❌ NÃO'}`)
  console.log(`   Active: ${updatedAdmin!.active}\n`)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email: admin@gemeas.com.br')
  console.log('🔑 Senha: admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n✅ Agora tente fazer login novamente!')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
