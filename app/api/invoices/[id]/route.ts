import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Obter fatura específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Fatura não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (authResult.role !== 'ADMIN' && invoice.clientId !== authResult.id) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar esta fatura' },
        { status: 403 }
      )
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Get invoice error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fatura' },
      { status: 500 }
    )
  }
}

// Atualizar fatura
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode atualizar faturas
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem atualizar faturas' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        description: data.description,
        amount: data.amount,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        attachments: data.attachments
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

    // Notificar cliente se fatura foi paga
    if (data.status === 'PAGO' && invoice.status !== 'PAGO') {
      await prisma.notification.create({
        data: {
          userId: invoice.clientId,
          title: '✅ Pagamento Confirmado',
          message: `O pagamento da fatura ${invoice.invoiceNumber} foi confirmado!`,
          type: 'success'
        }
      })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Update invoice error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar fatura' },
      { status: 500 }
    )
  }
}

// Deletar fatura
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar faturas' },
        { status: 403 }
      )
    }

    await prisma.invoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Fatura deletada com sucesso' })
  } catch (error) {
    console.error('Delete invoice error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar fatura' },
      { status: 500 }
    )
  }
}
