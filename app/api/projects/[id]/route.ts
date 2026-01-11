import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Next.js 16: params is a Promise
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cpf: true
          }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        workDiaries: {
          orderBy: { date: 'desc' },
          take: 10
        },
        phases: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    if (user.role !== 'ADMIN' && project.clientId !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projeto' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Next.js 16: params is a Promise
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const data = await request.json()

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        currentPhase: data.currentPhase,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        estimatedBudget: data.estimatedBudget ? parseFloat(data.estimatedBudget) : null,
        actualBudget: data.actualBudget ? parseFloat(data.actualBudget) : null,
        progress: data.progress ? parseInt(data.progress) : undefined,
        address: data.address,
        city: data.city,
        state: data.state,
        area: data.area ? parseFloat(data.area) : null
      },
      include: {
        client: true
      }
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar projeto' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Next.js 16: params is a Promise
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const data = await request.json()

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        currentPhase: data.currentPhase,
        clientId: data.clientId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        estimatedBudget: data.estimatedBudget,
        actualBudget: data.actualBudget,
        progress: data.progress,
        zipCode: data.zipCode,
        address: data.address,
        complement: data.complement,
        city: data.city,
        state: data.state,
        area: data.area,
        propertyCodes: data.propertyCodes || []
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

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar projeto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Next.js 16: params is a Promise
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Projeto excluído com sucesso' })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir projeto' },
      { status: 500 }
    )
  }
}

