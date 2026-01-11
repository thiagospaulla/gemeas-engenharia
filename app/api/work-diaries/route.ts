import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Listar diários de obras
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where: any = {}
    
    if (projectId) {
      where.projectId = projectId
    }

    const workDiaries = await prisma.workDiary.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ workDiaries })
  } catch (error) {
    console.error('Get work diaries error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar diários' },
      { status: 500 }
    )
  }
}

// Criar diário de obras
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode criar
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem criar registros' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Simular geração de IA (futuramente integrar com OpenAI/Gemini)
    const aiSummary = generateAISummary(data)
    const aiInsights = generateAIInsights(data)

    const workDiary = await prisma.workDiary.create({
      data: {
        projectId: data.projectId,
        date: new Date(data.date),
        weather: data.weather,
        temperature: data.temperature,
        workersPresent: data.workersPresent,
        activities: data.activities,
        materials: data.materials,
        equipment: data.equipment,
        observations: data.observations,
        photos: data.photos || [],
        aiSummary,
        aiInsights
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            client: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // Notificar cliente sobre atualização
    if (workDiary.project?.client) {
      await prisma.notification.create({
        data: {
          userId: workDiary.project.client.id,
          title: '📸 Nova Atualização da Obra',
          message: `Novo registro no diário de obras do projeto "${workDiary.project.title}"`,
          type: 'info',
          link: `/client/work-diaries/${workDiary.id}`
        }
      })
    }

    return NextResponse.json({ workDiary }, { status: 201 })
  } catch (error) {
    console.error('Create work diary error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar registro' },
      { status: 500 }
    )
  }
}

// Função simulada de IA - substituir por integração real
function generateAISummary(data: any): string {
  const activities = data.activities || ''
  const materials = data.materials || ''
  const workers = data.workersPresent || 0
  
  return `Registro de obra com ${workers} trabalhadores presentes. Atividades focadas em ${activities.split('\n')[0] || 'trabalhos gerais'}. ${materials ? 'Materiais diversos utilizados.' : ''} Condições climáticas: ${data.weather || 'normal'}.`
}

function generateAIInsights(data: any): string {
  const insights: string[] = []
  
  if (data.workersPresent && data.workersPresent > 10) {
    insights.push('✓ Boa produtividade com equipe numerosa')
  }
  
  if (data.weather === 'Chuvoso' || data.weather === 'Tempestade') {
    insights.push('⚠️ Condições climáticas podem afetar o cronograma')
  }
  
  if (data.observations && data.observations.toLowerCase().includes('atraso')) {
    insights.push('⚠️ Possível impacto no cronograma identificado')
  }
  
  if (data.materials) {
    insights.push('✓ Materiais utilizados documentados')
  }
  
  if (data.photos && data.photos.length > 3) {
    insights.push('✓ Boa documentação fotográfica')
  }
  
  return insights.length > 0 
    ? insights.join('\n') 
    : 'Registro completo. Continue documentando as atividades diárias.'
}
