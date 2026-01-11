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
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    const where: any = user.role === 'ADMIN' ? {} : { clientId: user.id }
    
    // Admin pode filtrar por cliente específico
    if (user.role === 'ADMIN' && clientId) {
      where.clientId = clientId
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        _count: {
          select: {
            documents: true,
            workDiaries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projetos' },
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

    const data = await request.json()

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status || 'ORCAMENTO',
        currentPhase: data.currentPhase,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        estimatedBudget: data.estimatedBudget ? parseFloat(data.estimatedBudget) : null,
        zipCode: data.zipCode,
        address: data.address,
        complement: data.complement,
        city: data.city,
        state: data.state,
        area: data.area ? parseFloat(data.area) : null,
        propertyCodes: data.propertyCodes || [],
        clientId: data.clientId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar projeto' },
      { status: 500 }
    )
  }
}

