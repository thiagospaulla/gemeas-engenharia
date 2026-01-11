import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Listar orçamentos
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')

    const where: any = {}
    
    // Admin pode ver todos, cliente só pode ver os seus
    if (authResult.role !== 'ADMIN') {
      where.clientId = authResult.id
    } else if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    const budgets = await prisma.budget.findMany({
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
        items: true,
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ budgets })
  } catch (error) {
    console.error('Get budgets error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orçamentos' },
      { status: 500 }
    )
  }
}

// Criar orçamento
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode criar orçamentos
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem criar orçamentos' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const budget = await prisma.budget.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        totalValue: data.totalValue,
        validUntil: new Date(data.validUntil),
        notes: data.notes,
        attachments: data.attachments || [],
        clientId: data.clientId,
        projectId: data.projectId,
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.category
          }))
        }
      },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Criar notificação para o cliente
    await prisma.notification.create({
      data: {
        userId: data.clientId,
        title: '💰 Novo Orçamento Disponível',
        message: `Um novo orçamento foi criado para você: ${data.title}`,
        type: 'info',
        link: `/client/budgets/${budget.id}`
      }
    })

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error('Create budget error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar orçamento' },
      { status: 500 }
    )
  }
}
