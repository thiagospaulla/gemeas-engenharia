import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Criando usuário administrador...')

  const email = 'admin@gemeas.com.br'
  const password = 'admin123' // ALTERE ESTA SENHA DEPOIS!
  
  // Verificar se admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('⚠️  Admin já existe!')
    console.log(`Email: ${existingAdmin.email}`)
    console.log(`Nome: ${existingAdmin.name}`)
    return
  }

  // Criar hash da senha
  const hashedPassword = await bcrypt.hash(password, 12)

  // Criar admin
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
      active: true, // Admin é sempre ativo
      phone: '(00) 00000-0000',
      cpf: '000.000.000-00'
    }
  })

  console.log('✅ Administrador criado com sucesso!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', email)
  console.log('🔑 Senha:', password)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
