import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const reports = await prisma.report.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar relatórios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const { type, projectId, period } = await request.json()

    let reportData: any = {}
    let content = ''

    switch (type) {
      case 'Gerencial':
        reportData = await generateManagerialReport(projectId)
        content = formatManagerialReport(reportData)
        break
      case 'Financeiro':
        reportData = await generateFinancialReport(projectId)
        content = formatFinancialReport(reportData)
        break
      case 'Técnico':
        reportData = await generateTechnicalReport(projectId)
        content = formatTechnicalReport(reportData)
        break
      case 'Progresso':
        reportData = await generateProgressReport(projectId)
        content = formatProgressReport(reportData)
        break
      default:
        return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        title: `Relatório ${type} - ${new Date().toLocaleDateString('pt-BR')}`,
        type,
        content,
        data: JSON.stringify(reportData),
        period,
        projectId: projectId || null
      }
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Create report error:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}

async function generateManagerialReport(projectId?: string) {
  const where = projectId ? { id: projectId } : {}
  
  const projects = await prisma.project.findMany({
    where,
    include: {
      client: true,
      _count: {
        select: {
          documents: true,
          workDiaries: true
        }
      }
    }
  })

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'EM_ANDAMENTO').length
  const completedProjects = projects.filter(p => p.status === 'CONCLUIDO').length
  const totalBudget = projects.reduce((sum, p) => sum + (p.estimatedBudget || 0), 0)

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalBudget,
    projects
  }
}

async function generateFinancialReport(projectId?: string) {
  const where = projectId ? { id: projectId } : {}
  
  const projects = await prisma.project.findMany({ where })

  const totalEstimated = projects.reduce((sum, p) => sum + (p.estimatedBudget || 0), 0)
  const totalActual = projects.reduce((sum, p) => sum + (p.actualBudget || 0), 0)
  const variance = totalEstimated - totalActual

  return {
    totalEstimated,
    totalActual,
    variance,
    variancePercentage: totalEstimated > 0 ? ((variance / totalEstimated) * 100).toFixed(2) : 0,
    projects
  }
}

async function generateTechnicalReport(projectId?: string) {
  const where = projectId ? { projectId } : {}
  
  const workDiaries = await prisma.workDiary.findMany({
    where,
    include: {
      project: true
    },
    orderBy: {
      date: 'desc'
    },
    take: 30
  })

  const totalDays = workDiaries.length
  const totalWorkers = workDiaries.reduce((sum, d) => sum + (d.workersPresent || 0), 0)
  const avgWorkers = totalDays > 0 ? (totalWorkers / totalDays).toFixed(1) : 0

  return {
    totalDays,
    totalWorkers,
    avgWorkers,
    workDiaries
  }
}

async function generateProgressReport(projectId?: string) {
  const where = projectId ? { id: projectId } : {}
  
  const projects = await prisma.project.findMany({
    where,
    include: {
      phases: true
    }
  })

  const avgProgress = projects.length > 0
    ? (projects.reduce((sum, p) => sum + p.progress, 0) / projects.length).toFixed(1)
    : 0

  return {
    avgProgress,
    projects
  }
}

function formatManagerialReport(data: any): string {
  return `
# Relatório Gerencial

## Resumo Executivo
- Total de Projetos: ${data.totalProjects}
- Projetos Ativos: ${data.activeProjects}
- Projetos Concluídos: ${data.completedProjects}
- Orçamento Total: R$ ${data.totalBudget.toLocaleString('pt-BR')}

## Detalhamento dos Projetos
${data.projects.map((p: any) => `
### ${p.title}
- Cliente: ${p.client.name}
- Status: ${p.status}
- Progresso: ${p.progress}%
- Orçamento: R$ ${(p.estimatedBudget || 0).toLocaleString('pt-BR')}
`).join('\n')}
  `.trim()
}

function formatFinancialReport(data: any): string {
  return `
# Relatório Financeiro

## Resumo Financeiro
- Orçamento Estimado: R$ ${data.totalEstimated.toLocaleString('pt-BR')}
- Custo Real: R$ ${data.totalActual.toLocaleString('pt-BR')}
- Variação: R$ ${data.variance.toLocaleString('pt-BR')} (${data.variancePercentage}%)

## Análise por Projeto
${data.projects.map((p: any) => `
### ${p.title}
- Estimado: R$ ${(p.estimatedBudget || 0).toLocaleString('pt-BR')}
- Real: R$ ${(p.actualBudget || 0).toLocaleString('pt-BR')}
`).join('\n')}
  `.trim()
}

function formatTechnicalReport(data: any): string {
  return `
# Relatório Técnico

## Estatísticas de Obra
- Total de Dias Registrados: ${data.totalDays}
- Total de Trabalhadores: ${data.totalWorkers}
- Média de Trabalhadores/Dia: ${data.avgWorkers}

## Últimas Atividades
${data.workDiaries.slice(0, 10).map((d: any) => `
### ${new Date(d.date).toLocaleDateString('pt-BR')}
- Projeto: ${d.project.title}
- Trabalhadores: ${d.workersPresent || 'N/A'}
- Clima: ${d.weather || 'N/A'}
- Atividades: ${d.activities.substring(0, 100)}...
`).join('\n')}
  `.trim()
}

function formatProgressReport(data: any): string {
  return `
# Relatório de Progresso

## Visão Geral
- Progresso Médio: ${data.avgProgress}%

## Progresso por Projeto
${data.projects.map((p: any) => `
### ${p.title}
- Progresso: ${p.progress}%
- Status: ${p.status}
- Fase Atual: ${p.currentPhase || 'N/A'}
- Fases Concluídas: ${p.phases.filter((ph: any) => ph.status === 'completed').length}/${p.phases.length}
`).join('\n')}
  `.trim()
}

