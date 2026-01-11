import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Obter orçamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
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
      }
    })

    if (!budget) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (authResult.role !== 'ADMIN' && budget.clientId !== authResult.id) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este orçamento' },
        { status: 403 }
      )
    }

    return NextResponse.json({ budget })
  } catch (error) {
    console.error('Get budget error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orçamento' },
      { status: 500 }
    )
  }
}

// Atualizar orçamento
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const data = await request.json()

    const existingBudget = await prisma.budget.findUnique({
      where: { id }
    })

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Admin pode atualizar tudo, cliente só pode atualizar status
    if (authResult.role !== 'ADMIN' && existingBudget.clientId !== authResult.id) {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar este orçamento' },
        { status: 403 }
      )
    }

    const updateData: any = {}

    // Admin pode atualizar tudo
    if (authResult.role === 'ADMIN') {
      updateData.title = data.title
      updateData.description = data.description
      updateData.type = data.type
      updateData.totalValue = data.totalValue
      updateData.validUntil = data.validUntil ? new Date(data.validUntil) : undefined
      updateData.notes = data.notes
      updateData.attachments = data.attachments
    }

    // Cliente pode aprovar/rejeitar
    if (data.status) {
      updateData.status = data.status
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: updateData,
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

    // Notificar admins quando cliente aprovar ou rejeitar
    if (data.status && authResult.role === 'CLIENT') {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      })

      if (data.status === 'APROVADO') {
        await Promise.all(
          admins.map(admin =>
            prisma.notification.create({
              data: {
                userId: admin.id,
                title: '✅ Orçamento Aprovado!',
                message: `O cliente ${budget.client.name} aprovou o orçamento "${budget.title}"`,
                type: 'success',
                link: `/admin/budgets/${id}`
              }
            })
          )
        )
      } else if (data.status === 'REJEITADO') {
        await Promise.all(
          admins.map(admin =>
            prisma.notification.create({
              data: {
                userId: admin.id,
                title: '❌ Orçamento Rejeitado',
                message: `O cliente ${budget.client.name} rejeitou o orçamento "${budget.title}"${data.notes ? '. Motivo: ' + data.notes : ''}`,
                type: 'warning',
                link: `/admin/budgets/${id}`
              }
            })
          )
        )
      }
    }

    return NextResponse.json({ budget })
  } catch (error) {
    console.error('Update budget error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar orçamento' },
      { status: 500 }
    )
  }
}

// Deletar orçamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar orçamentos' },
        { status: 403 }
      )
    }

    await prisma.budget.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Orçamento deletado com sucesso' })
  } catch (error) {
    console.error('Delete budget error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar orçamento' },
      { status: 500 }
    )
  }
}
