import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

// Atualizar usuário (aprovar, promover a admin, editar dados)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const data = await request.json()
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active,
        phone: data.phone,
        cpf: data.cpf,
        cnpj: data.cnpj,
        address: data.address,
        complement: data.complement,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        phone: true,
        cpf: true,
        city: true,
        state: true,
        createdAt: true
      }
    })

    // Criar notificação para o usuário
    if (data.active && !user.active) {
      await prisma.notification.create({
        data: {
          userId: userId,
          title: '✅ Conta Aprovada!',
          message: 'Sua conta foi aprovada pelo administrador. Você já pode acessar o sistema.',
          type: 'success'
        }
      })
    }

    if (data.role === 'ADMIN' && user.role !== 'ADMIN') {
      await prisma.notification.create({
        data: {
          userId: userId,
          title: '👑 Promovido a Administrador!',
          message: 'Você foi promovido a administrador do sistema. Agora você tem acesso completo.',
          type: 'info'
        }
      })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    )
  }
}

// Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const userId = params.id

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    )
  }
}

// Obter usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        phone: true,
        cpf: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            documents: true,
            budgets: true,
            invoices: true,
            appointments: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    )
  }
}
