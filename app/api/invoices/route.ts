import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Listar faturas
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

    const invoices = await prisma.invoice.findMany({
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

    // Atualizar status de faturas atrasadas
    const now = new Date()
    const overdueInvoices = invoices.filter(
      inv => inv.status === 'PENDENTE' && inv.dueDate < now
    )

    if (overdueInvoices.length > 0) {
      await Promise.all(
        overdueInvoices.map(inv =>
          prisma.invoice.update({
            where: { id: inv.id },
            data: { status: 'ATRASADO' }
          })
        )
      )
    }

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar faturas' },
      { status: 500 }
    )
  }
}

// Criar fatura
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode criar faturas
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem criar faturas' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Gerar número de fatura único
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    const invoiceNumber = lastInvoice
      ? `FAT-${(parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1).toString().padStart(6, '0')}`
      : 'FAT-000001'

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        description: data.description,
        amount: data.amount,
        status: data.status || 'PENDENTE',
        issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
        dueDate: new Date(data.dueDate),
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        attachments: data.attachments || [],
        clientId: data.clientId,
        projectId: data.projectId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // Criar notificação para o cliente
    await prisma.notification.create({
      data: {
        userId: data.clientId,
        title: '💵 Nova Fatura Emitida',
        message: `Nova fatura ${invoiceNumber} no valor de R$ ${data.amount.toFixed(2)}`,
        type: 'info',
        link: `/client/invoices/${invoice.id}`
      }
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar fatura' },
      { status: 500 }
    )
  }
}
