import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gemeas.com' },
    update: {},
    create: {
      name: 'Administrador Gêmeas',
      email: 'admin@gemeas.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '(34) 99282-0807',
      city: 'Uberlândia',
      state: 'MG'
    }
  })
  console.log('✅ Admin criado:', admin.email)

  // Criar clientes
  const clientPassword = await bcrypt.hash('cliente123', 12)
  
  const client1 = await prisma.user.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      password: clientPassword,
      role: 'CLIENT',
      phone: '(34) 98765-4321',
      cpf: '123.456.789-00',
      address: 'Rua das Flores, 123',
      city: 'Uberlândia',
      state: 'MG',
      zipCode: '38400-000'
    }
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'maria.santos@email.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      password: clientPassword,
      role: 'CLIENT',
      phone: '(34) 98888-7777',
      cpf: '987.654.321-00',
      address: 'Av. Principal, 456',
      city: 'Uberlândia',
      state: 'MG',
      zipCode: '38400-100'
    }
  })

  console.log('✅ Clientes criados')

  // Criar projetos
  const project1 = await prisma.project.create({
    data: {
      title: 'Residência Moderna - Jardim Europa',
      description: 'Projeto de residência unifamiliar com 3 suítes, piscina e área gourmet',
      type: 'Residencial',
      status: 'EM_ANDAMENTO',
      currentPhase: 'ESTRUTURA',
      startDate: new Date('2024-01-15'),
      estimatedBudget: 850000,
      actualBudget: 420000,
      progress: 45,
      address: 'Rua das Acácias, 789',
      city: 'Uberlândia',
      state: 'MG',
      area: 320,
      clientId: client1.id
    }
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Edifício Comercial - Centro',
      description: 'Prédio comercial de 5 andares com estacionamento',
      type: 'Comercial',
      status: 'EM_ANDAMENTO',
      currentPhase: 'FUNDACAO',
      startDate: new Date('2024-02-01'),
      estimatedBudget: 2500000,
      actualBudget: 650000,
      progress: 25,
      address: 'Av. João Naves, 1234',
      city: 'Uberlândia',
      state: 'MG',
      area: 1200,
      clientId: client2.id
    }
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'Casa de Campo - Condomínio Fechado',
      description: 'Casa de campo com arquitetura sustentável',
      type: 'Residencial',
      status: 'CONCLUIDO',
      currentPhase: 'FINALIZACAO',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-03-15'),
      estimatedBudget: 650000,
      actualBudget: 680000,
      progress: 100,
      address: 'Condomínio Vale Verde, Lote 45',
      city: 'Uberlândia',
      state: 'MG',
      area: 280,
      clientId: client1.id
    }
  })

  console.log('✅ Projetos criados')

  // Criar fases do projeto
  await prisma.projectPhaseDetail.createMany({
    data: [
      {
        projectId: project1.id,
        phase: 'PLANEJAMENTO',
        name: 'Planejamento e Aprovação',
        status: 'completed',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-01'),
        progress: 100,
        budget: 50000,
        actualCost: 48000
      },
      {
        projectId: project1.id,
        phase: 'FUNDACAO',
        name: 'Fundação e Terraplanagem',
        status: 'completed',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-03-10'),
        progress: 100,
        budget: 150000,
        actualCost: 155000
      },
      {
        projectId: project1.id,
        phase: 'ESTRUTURA',
        name: 'Estrutura de Concreto',
        status: 'in_progress',
        startDate: new Date('2024-03-15'),
        progress: 60,
        budget: 250000,
        actualCost: 180000
      }
    ]
  })

  // Criar diários de obra
  await prisma.workDiary.createMany({
    data: [
      {
        projectId: project1.id,
        date: new Date('2024-12-20'),
        weather: 'Ensolarado',
        temperature: '28°C',
        workersPresent: 12,
        activities: 'Concretagem das vigas do segundo pavimento. Instalação de armação de ferro nas colunas. Preparação de formas para laje.',
        materials: 'Concreto usinado (15m³), Ferro CA-50 (2 toneladas), Madeira para formas',
        equipment: 'Betoneira, Vibrador de concreto, Guincho',
        observations: 'Trabalho dentro do cronograma. Qualidade do concreto aprovada.',
        photos: [],
        aiSummary: 'Dia produtivo com concretagem bem-sucedida do segundo pavimento. Equipe completa e clima favorável.',
        aiInsights: '✅ Progresso conforme planejado\n✅ Clima favorável para concretagem\n✅ Equipe completa presente'
      },
      {
        projectId: project1.id,
        date: new Date('2024-12-19'),
        weather: 'Parcialmente nublado',
        temperature: '26°C',
        workersPresent: 10,
        activities: 'Montagem de formas para vigas. Corte e dobra de ferragens. Limpeza do canteiro de obras.',
        materials: 'Madeira compensada, Pregos, Arame recozido',
        equipment: 'Serra circular, Dobrador de ferro',
        observations: 'Dois funcionários faltaram por motivo de saúde.',
        photos: [],
        aiSummary: 'Preparação para concretagem. Equipe reduzida mas produtiva.',
        aiInsights: '⚠️ Equipe reduzida pode impactar o cronograma.'
      }
    ]
  })

  console.log('✅ Diários de obra criados')

  // Criar documentos
  await prisma.document.createMany({
    data: [
      {
        projectId: project1.id,
        uploadedById: admin.id,
        title: 'Projeto Arquitetônico Aprovado',
        description: 'Projeto completo aprovado pela prefeitura',
        fileName: 'projeto-arquitetonico.pdf',
        fileUrl: '/documents/projeto-arquitetonico.pdf',
        fileSize: 5242880,
        fileType: 'application/pdf',
        category: 'Projeto'
      },
      {
        projectId: project1.id,
        uploadedById: admin.id,
        title: 'Alvará de Construção',
        description: 'Alvará emitido pela prefeitura municipal',
        fileName: 'alvara-construcao.pdf',
        fileUrl: '/documents/alvara-construcao.pdf',
        fileSize: 1048576,
        fileType: 'application/pdf',
        category: 'Licença'
      },
      {
        projectId: project1.id,
        uploadedById: client1.id,
        title: 'Contrato de Prestação de Serviços',
        description: 'Contrato assinado entre as partes',
        fileName: 'contrato.pdf',
        fileUrl: '/documents/contrato.pdf',
        fileSize: 2097152,
        fileType: 'application/pdf',
        category: 'Contrato'
      }
    ]
  })

  console.log('✅ Documentos criados')

  // Criar notificações
  await prisma.notification.createMany({
    data: [
      {
        userId: client1.id,
        title: 'Novo Diário de Obra',
        message: 'Um novo diário de obra foi adicionado ao projeto Residência Moderna',
        type: 'info',
        link: '/client/projects/' + project1.id
      },
      {
        userId: client1.id,
        title: 'Projeto Atualizado',
        message: 'O progresso do seu projeto foi atualizado para 45%',
        type: 'success',
        link: '/client/projects/' + project1.id
      }
    ]
  })

  console.log('✅ Notificações criadas')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

